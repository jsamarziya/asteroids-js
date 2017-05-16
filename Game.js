"use strict";

/**
 * The maximum time delta (in milliseconds) that {@link Game#update} will accept. Time deltas greater than this are
 * discarded, to prevent {@link https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe wormholes}.
 * @type {number}
 */
const MAX_DELTA_TIME = 160;
/**
 * The reference time delta (in milliseconds), which is based on a nominal 60 frames per second.
 * @type {number}
 */
const REFERENCE_DELTA_TIME = 1000 / 60;
/**
 * The reference (nominal) canvas width.
 * @type {number}
 */
const REFERENCE_WIDTH = 4000;
/**
 * The reference (nominal) canvas height.
 * @type {number}
 */
const REFERENCE_HEIGHT = 3000;
/**
 * The comparator function used to keep the sprite array in sorted order.
 */
const SPRITE_Z_INDEX_COMPARATOR = function (a, b) {
    //noinspection JSConstructorReturnsPrimitive
    return a.z - b.z;
};

/**
 * The game engine object.
 */
class Game {
    /**
     * Constructs a new Game.
     * @param {HTMLElement} container the HTML element that is the parent of the canvas elements
     * @param {HTMLCanvasElement} gameCanvas the canvas on which the game is drawn
     * @param {HTMLCanvasElement} overlayCanvas the canvas on which the overlay is drawn
     * @param {HTMLCanvasElement} debugCanvas the canvas on which the debug layer is drawn
     */
    constructor(container, gameCanvas, overlayCanvas, debugCanvas) {
        this.container = container;
        this.gameCanvas = gameCanvas;
        this.overlayCanvas = overlayCanvas;
        this.debugCanvas = debugCanvas;
        this.gameContext = gameCanvas.getContext("2d");
        this.overlayContext = overlayCanvas.getContext("2d");
        this.debugContext = debugCanvas.getContext("2d");
        this.inputManager = new InputManager();
        this.scheduler = new Scheduler();
        this.sounds = {};
        this.lastUpdate = 0;
        this.paused = false;
        this.showDebug = false;
        this.drawDebug = false;
        this.sprites = [];
        this.initializeContexts();
    }

    /**
     * Initializes the graphics contexts.
     */
    initializeContexts() {
        this.initializeGameContext();
        this.initializeOverlayContext();
        this.initializeDebugContext();
        this.initializeAudio();
    }

    /**
     * Initializes the game canvas graphics context.
     */
    initializeGameContext() {
    }

    /**
     * Initializes the overlay canvas graphics context.
     */
    initializeOverlayContext() {
        this.updateOverlay = true;
    }

    /**
     * Initializes the debug canvas graphics context.
     */
    initializeDebugContext() {
        this.debugContext.fillStyle = "#A0A0A0";
    }

    /**
     * Initializes the audio system.
     */
    initializeAudio() {
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Returns the style used to draw drawDebug elements.
     * @returns {string} the drawDebug style
     */
    get drawDebugStyle() {
        return "#BB0000";
    }

    /**
     * Returns the specified width, scaled to the canvas width.
     * @param {number} width the width to scale
     * @returns {number} the scaled width
     */
    getScaledWidth(width) {
        return width / REFERENCE_WIDTH * this.gameCanvas.width;
    }

    /**
     * Returns the specified height, scaled to the canvas width.
     * @param {number} height the height to scale
     * @returns {number} the scaled height
     */
    getScaledHeight(height) {
        return height / REFERENCE_HEIGHT * this.gameCanvas.height;
    }

    /**
     * Resizes the canvases and their container to fit the specified window.
     * @param {Window} window the window
     */
    resizeDisplayElementsToWindow(window) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let width = windowWidth * 0.9;
        let height = width * 3 / 4;
        if (height > windowHeight * 0.9) {
            height = windowHeight * 0.9;
            width = height * 4 / 3;
        }
        this.resizeDisplayElements(Math.floor(width), Math.floor(height));
    }

    /**
     * Resizes the canvases and their container to the specified size.
     * @param {number} width the width
     * @param {number} height the height
     */
    resizeDisplayElements(width, height) {
        this.container.style.width = `${width}px`;
        this.container.style.height = `${height}px`;
        [this.gameCanvas, this.overlayCanvas, this.debugCanvas].forEach(element => {
            element.width = width;
            element.height = height;
        });
        this.initializeContexts();
    }

    /**
     * Starts the game.
     */
    start() {
        this.requestAnimationFrame();
    }

    /**
     * Registers {@link Game#update} as a {@link Window#requestAnimationFrame} callback.
     */
    requestAnimationFrame() {
        window.requestAnimationFrame(this.update.bind(this));
    }

    /**
     * The game's {@link Window#requestAnimationFrame} callback function.
     * @param {number} timestamp the timestamp
     */
    update(timestamp) {
        performance.mark("gameUpdateStart");
        this.requestAnimationFrame();
        const dt = timestamp - this.lastUpdate;
        this.lastUpdate = timestamp;
        this.fps = 1000 / dt;
        if (!this.paused && dt <= MAX_DELTA_TIME) {
            this.updateState(dt);
        }
        if (this.updateOverlay) {
            this.drawOverlayLayer();
            this.updateOverlay = false;
        }
        this.drawGameLayer();
        if (this.showDebug) {
            this.drawDebugLayer();
        }
        performance.mark("gameUpdateEnd");
        performance.measure("gameUpdateElapsed", "gameUpdateStart", "gameUpdateEnd");
        performance.clearMarks("gameUpdateStart");
        performance.clearMarks("gameUpdateEnd");
    }

    /**
     * Updates the game state.
     * @param {number} dt the time delta
     */
    updateState(dt) {
        this.scheduler.advanceTime(dt);
        this.sprites.slice().forEach(sprite => sprite.update(dt));
        this.detectCollisions();
    }

    /**
     * Draws the overlay layer.
     */
    drawOverlayLayer() {
    }

    /**
     * Draws the game layer.
     */
    drawGameLayer() {
        this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.drawBackground();
        this.sprites.slice().forEach(sprite => sprite.draw());
    }

    /**
     * Draws the game's background.
     */
    drawBackground() {
    }

    /**
     * Draws the debug layer.
     */
    drawDebugLayer() {
        const gameUpdateElapsed = performance.getEntriesByName("gameUpdateElapsed")[0];
        performance.clearMeasures("gameUpdateElapsed");
        this.debugContext.save();
        this.debugContext.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
        this.debugContext.translate(10, this.debugCanvas.height - 10);
        this.debugContext.fillText(`FPS: ${this.fps.toFixed(3)}`, 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText(`Update: ${gameUpdateElapsed.duration.toFixed(2)}ms`, 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText(`Sprites: ${this.sprites.length}`, 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.drawDebugLayerExtensions();
        this.debugContext.restore();
    }

    /**
     * A hook method that can be overridden to add more elements to the debug layer.
     */
    drawDebugLayerExtensions() {
    }

    /**
     * Causes the container element to request that it be displayed full-screen.
     */
    requestFullScreenMode() {
        ( this.container.mozRequestFullScreen && this.container.mozRequestFullScreen() ) ||
        ( this.container.webkitRequestFullScreen && this.container.webkitRequestFullScreen() ) ||
        ( this.container.requestFullScreen && this.container.requestFullScreen());
    }

    /**
     * Toggle the paused state of the game.
     */
    togglePaused() {
        this.paused = !this.paused;
    }

    /**
     * Toggles the visibility of the debug layer.
     */
    toggleShowDebug() {
        this.showDebug = !this.showDebug;
        this.debugCanvas.style.visibility = this.showDebug ? "visible" : "hidden";
    }

    /**
     * Toggles the drawDebug flag.
     */
    toggleDrawDebug() {
        this.drawDebug = !this.drawDebug;
    }

    /**
     * Adds a sprite to this game.
     * @param {Sprite} sprite the sprite
     */
    addSprite(sprite) {
        insertSorted(this.sprites, sprite, SPRITE_Z_INDEX_COMPARATOR);
    }

    /**
     * Removes a sprite from this game.
     * @param {Sprite} sprite the sprite
     */
    removeSprite(sprite) {
        remove(this.sprites, sprite);
    }

    /**
     * Returns the number of sprites of the specified type currently in existence.
     * @param {function} type the type of sprite to count
     * @returns {number} the number of sprites of the specified type currently in existence
     */
    getSpriteCount(type) {
        return this.sprites.reduce((prev, curr) => {
            return prev + (curr instanceof type);
        }, 0);
    }

    /**
     * Detects collisions between sprites.
     */
    detectCollisions() {
        const sprites = this.sprites.slice();
        for (let i = 0; i < sprites.length; i++) {
            for (let j = i + 1; j < sprites.length; j++) {
                sprites[i].checkForCollision(sprites[j]);
            }
        }
    }

    /**
     * Called to notify this game that the player destroyed an object.
     * @param {Sprite} sprite the object that the player destroyed
     */
    objectDestroyedByPlayer(sprite) {
    }

    /**
     * Called to notify this game that the player was destroyed.
     */
    playerDestroyed() {
    }
}

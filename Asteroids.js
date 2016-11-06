"use strict";

/**
 * The delay (in milliseconds) before a ship or a set of asteroids is added to the play field.
 * @type {number}
 */
const TRANSITION_DELAY = 2000;

/**
 * The Asteroids game.
 */
class Asteroids extends Game {
    /**
     * Constructs a new Asteroids game.
     * @param {HTMLElement} container the HTML element that is the parent of the canvas elements
     * @param {HTMLCanvasElement} gameCanvas the canvas on which the game is drawn
     * @param {HTMLCanvasElement} overlayCanvas the canvas on which the overlay is drawn
     * @param {HTMLCanvasElement} debugCanvas the canvas on which the debug layer is drawn
     */
    constructor(container, gameCanvas, overlayCanvas, debugCanvas) {
        super(container, gameCanvas, overlayCanvas, debugCanvas);
        this.createStars();
        this.createAsteroids();
    }

    /**
     * @override
     * @inheritDoc
     */
    initializeGameContext() {
        super.initializeGameContext();
        this.gameContext.strokeStyle = "white";
        this.gameContext.fillStyle = "black";
    }

    /**
     * @override
     * @inheritDoc
     */
    initializeOverlayContext() {
        super.initializeOverlayContext();
        this.overlayContext.fillStyle = "#A0A0A0";
        this.overlayContext.font = "16px sans-serif";
    }

    /**
     * Returns the number of asteroids created by createAsteroids() at the start of a level.
     * @return {number} the number of asteroids
     */
    get asteroidCount() {
        const level = this.player ? this.player.level : 1;
        return Math.min((level + 1) * 2, 14);
    }

    /**
     * Starts a new game.
     */
    startNewGame() {
        if (this.player && this.player.lives) {
            return;
        }
        this.player = new Player();
        this.sprites.length = 0;
        this.createShip();
        this.scheduler.schedule(this.createAsteroids.bind(this), TRANSITION_DELAY);
        this.updateOverlay = true;
    }

    /**
     * Creates the player's ship.
     */
    createShip() {
        const ship = new Ship(this);
        ship.x = REFERENCE_WIDTH / 2;
        ship.y = REFERENCE_HEIGHT / 2;
        this.ship = ship;
        this.addSprite(ship);
    }

    /**
     * Creates some large asteroids and adds them to the play field.
     */
    createAsteroids() {
        for (let i = 0; i < this.asteroidCount; i++) {
            this.createAsteroid(ASTEROID_TYPE.LARGE, (0.5 - Math.random()) * REFERENCE_WIDTH / 2.5, Math.random() * REFERENCE_HEIGHT);
        }
    }

    /**
     * Creates an asteroid.
     * @param {Object} type the type of asteroid to create
     * @param {number} x the x-coordinate of the asteroid's position
     * @param {number} y the y-coordinate of the asteroid's position
     */
    createAsteroid(type, x, y) {
        const asteroid = new Asteroid(this, type);
        asteroid.x = x;
        asteroid.y = y;
        asteroid.dx = (0.5 - Math.random() ) * 200;
        asteroid.dy = (0.5 - Math.random() ) * 400;
        asteroid.rpm = (0.5 - Math.random()) * 8;
        this.addSprite(asteroid);
    }

    /**
     * Creates the background stars.
     */
    createStars() {
        this.stars = [];
        for (let i = 0; i < 15; i++) {
            this.stars.push({x: Math.random() * REFERENCE_WIDTH, y: Math.random() * REFERENCE_HEIGHT});
        }
    }

    /**
     * Draws the background.
     */
    drawBackground() {
        const ctx = this.gameContext;
        ctx.save();
        ctx.fillStyle = "white";
        this.stars.forEach(star => {
            ctx.fillRect(this.getScaledWidth(star.x), this.getScaledHeight(star.y), 1, 1);
        });
        ctx.restore();
    }

    /**
     * @override
     * @inheritDoc
     */
    drawOverlayLayer() {
        const player = this.player;
        let score, lives, level;
        if (player) {
            score = player.score;
            lives = player.lives;
            level = player.level;
        } else {
            score = 0;
            lives = level = "-";
        }
        this.overlayContext.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        this.overlayContext.fillText(`Score: ${score}`, 10, 20);
        this.overlayContext.fillText(`Lives: ${lives}`, 200, 20);
        this.overlayContext.fillText(`Level: ${level}`, 400, 20);
    }

    /**
     * @override
     * @inheritDoc
     */
    drawDebugLayerExtensions() {
        const ship = this.ship;
        let pos, v, heading;
        if (ship) {
            const location = {
                x: Math.floor(ship.scaledX),
                y: Math.floor(ship.scaledY)
            };
            const velocity = {
                x: Math.round(this.getScaledWidth(ship.dx)),
                y: Math.round(this.getScaledHeight(ship.dy))
            };
            const rotationDegrees = Math.floor(ship.rotation * 180 / Math.PI);
            pos = `(${location.x}, ${location.y})`;
            v = `(${velocity.x}, ${velocity.y})`;
            heading = `${rotationDegrees}\xB0`;
        } else {
            pos = v = heading = '-';
        }
        this.debugContext.fillText(`pos: ${pos}`, 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText(`v: ${v}`, 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText(`\u03b8: ${heading}`, 0, 0, 100);
    }

    /**
     * @override
     * @inheritDoc
     */
    removeSprite(sprite) {
        super.removeSprite(sprite);
        if (sprite instanceof Asteroid) {
            this.asteroidDestroyed();
        }
    }

    /**
     * Called to notify this game that an asteroid was destroyed.
     */
    asteroidDestroyed() {
        if (this.getSpriteCount(Asteroid) == 0) {
            this.scheduler.schedule(this.nextLevel.bind(this), TRANSITION_DELAY);
        }
    }

    /**
     * Increments the player's level and adds asteroids to the play field.
     */
    nextLevel() {
        this.player.level++;
        this.updateOverlay = true;
        this.createAsteroids();
    }

    /**
     * @override
     * @inheritDoc
     */
    objectDestroyedByPlayer(sprite) {
        super.objectDestroyedByPlayer(sprite);
        this.player.score += sprite.points;
        this.updateOverlay = true;
    }

    /**
     * @override
     * @inheritDoc
     */
    playerDestroyed() {
        delete this.ship;
        super.playerDestroyed();
        if (--this.player.lives) {
            this.scheduler.schedule(this.createShip.bind(this), TRANSITION_DELAY);
        }
    }
}

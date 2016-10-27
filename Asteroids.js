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
     * @param {HTMLCanvasElement} debugCanvas the canvas on which the debug layer is drawn
     */
    constructor(container, gameCanvas, debugCanvas) {
        super(container, gameCanvas, debugCanvas);
        this.createStars();
        this.scheduleCreateAsteroids();
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
        // TODO we should maybe keep the existing array and just remove all of its elements?
        this.sprites = [];
        this.createShip();
        this.scheduleCreateAsteroids();
    }

    /**
     * Creates the player's ship.
     */
    createShip() {
        // TODO check for clear area before creating ship
        const ship = new Ship(this);
        ship.x = REFERENCE_WIDTH / 2;
        ship.y = REFERENCE_HEIGHT / 2;
        this.ship = ship;
        this.addSprite(ship);
    }

    /**
     * Schedules a createAsteroids() call.
     */
    scheduleCreateAsteroids() {
        this.scheduler.schedule(this.createAsteroids.bind(this), TRANSITION_DELAY);
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
        // TODO check for proximity to ship before placing? or caveat player?
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
    drawDebugLayerExtensions() {
        const ship = this.ship;
        const x = ship ? Math.floor(ship.scaledX) : '-';
        const y = ship ? Math.floor(ship.scaledY) : '-';
        const dx = ship ? Math.round(this.getScaledWidth(ship.dx)) : '-';
        const dy = ship ? Math.round(this.getScaledHeight(ship.dy)) : '-';
        const heading = ship ? Math.floor(ship.rotation * 180 / Math.PI) + "\xB0" : '-';
        this.debugContext.fillText("pos: (" + x + ", " + y + ")", 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText("v: (" + dx + ", " + dy + ")", 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText("\u03b8: " + heading, 0, 0, 100);
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
            this.scheduleCreateAsteroids();
        }
    }

    /**
     * @override
     * @inheritDoc
     */
    playerDestroyed() {
        // TODO is this the preferred way to remove a property from an object?
        this.ship = undefined;
        super.playerDestroyed();
        if (--this.player.lives) {
            this.scheduler.schedule(this.createShip.bind(this), TRANSITION_DELAY);
        }
    }
}

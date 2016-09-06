"use strict";

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
        this.createShip();
        this.asteroidCount = 6;
        this.scheduler.schedule(this.createAsteroids.bind(this), 1000);
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
            this.createAsteroid(ASTEROID_TYPE.LARGE, (0.5 - Math.random()) * REFERENCE_WIDTH/2.5, Math.random() * REFERENCE_HEIGHT);
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
    drawDebugLayerExtensions() {
        this.debugContext.fillText("pos: (" + Math.floor(this.ship.scaledX) + ", " + Math.floor(this.ship.scaledY) + ")", 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText("v: (" + Math.round(this.getScaledWidth(this.ship.dx)) + ", " + Math.round(this.getScaledHeight(this.ship.dy)) + ")", 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText("\u03b8: " + Math.floor(this.ship.rotation * 180 / Math.PI) + "\xB0", 0, 0, 100);
    }
}

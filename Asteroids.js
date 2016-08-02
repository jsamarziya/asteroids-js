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

        this.scheduler.schedule(this.createAsteroid.bind(this, ASTEROID_SIZE_LARGE, 1000, 1000), 3000);
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
        this.sprites.push(ship);
    }

    /**
     * Creates an asteroid.
     * @param {number} size the size of the asteroid to create
     * @param {number} x the x-coordinate of the asteroid's location
     * @param {number} y the y-coordinate of the asteroid's location
     */
    createAsteroid(size, x, y) {
        const asteroid = new Asteroid(this, size);
        asteroid.x = x;
        asteroid.y = y;
        // asteroid.dx = (0.5-Math.random() )*10+5;
        // asteroid.dy = (0.5-Math.random() )*10+40;
        asteroid.rpm = (0.5 - Math.random()) * 6;
        this.sprites.push(asteroid);
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

    /**
     * Returns the number of bullets currently in existence
     * @returns {number} the number of bullets
     */
    get bulletCount() {
        return this.sprites.reduce((prev, curr)=> {
            return prev + (curr instanceof Bullet);
        }, 0);
    }
}

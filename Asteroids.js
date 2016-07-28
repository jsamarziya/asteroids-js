"use strict";

class Asteroids extends Game {
    constructor(container, gameCanvas, debugCanvas) {
        super(container, gameCanvas, debugCanvas);
        this.createStars();
        this.createShip();

        this.scheduler.schedule(this.createAsteroid.bind(this, 100, 200, 200), 3000);
    }

    initializeGameContext() {
        super.initializeGameContext();
        this.gameContext.strokeStyle = "white";
        this.gameContext.fillStyle = "black";
    }

    createShip() {
        const ship = new Ship(this);
        ship.x = this.gameCanvas.width / 2;
        ship.y = this.gameCanvas.height / 2;
        this.ship = ship;
        this.sprites.push(ship);
    }

    createAsteroid(size, x, y) {
        const asteroid = new Asteroid(this, size);
        asteroid.x = x;
        asteroid.y = y;
        // asteroid.dx = (0.5-Math.random() )*10+5;
        // asteroid.dy = (0.5-Math.random() )*10+40;
        asteroid.rpm = (0.5 - Math.random()) * 6;
        this.sprites.push(asteroid);
    }

    createStars() {
        this.stars = [];
        for (let i = 0; i < 15; i++) {
            this.stars.push({x: Math.random() * REFERENCE_WIDTH, y: Math.random() * REFERENCE_HEIGHT});
        }
    }

    drawBackground() {
        const ctx = this.gameContext;
        ctx.save();
        ctx.fillStyle = "white";
        this.stars.forEach(star => {
            ctx.fillRect(star.x / REFERENCE_WIDTH * this.gameCanvas.width, star.y / REFERENCE_HEIGHT * this.gameCanvas.height, 1, 1);
        });
        ctx.restore();
    }

    drawDebugLayer() {
        super.drawDebugLayer();
        const textY = this.debugTextY;
        this.debugContext.fillText("FPS: " + this.fps.toFixed(3), 10, textY, 100);
        this.debugContext.fillText("pos: (" + Math.floor(this.ship.x) + ", " + Math.floor(this.ship.y) + ")", 100, textY, 100);
        this.debugContext.fillText("v: (" + Math.round(this.ship.dx) + ", " + Math.round(this.ship.dy) + ")", 200, textY, 100);
        this.debugContext.fillText("dir: " + Math.floor(this.ship.rotation * 180 / Math.PI), 300, textY, 100);
    }

    get bulletCount() {
        return this.sprites.reduce((prev, curr)=> {
            return prev + (curr instanceof Bullet);
        }, 0);
    }
}

"use strict";

class Asteroids extends Game {
    constructor(container, gameCanvas, debugCanvas) {
        super(container, gameCanvas, debugCanvas);
        this.initGameContext();
        this.createStars();
        this.createShip();

        this.scheduler.schedule(this.createAsteroid.bind(this, 100, 200, 200), 3000);
    }

    initGameContext() {
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
        const width = this.gameCanvas.width;
        const height = this.gameCanvas.height;
        for (let i = 0; i < 15; i++) {
            this.stars.push({x: Math.random() * width, y: Math.random() * height});
        }
    }

    drawBackground() {
        const ctx = this.gameContext;
        ctx.save();
        ctx.fillStyle = "white";
        this.stars.forEach(star => {
            ctx.fillRect(star.x, star.y, 1, 1);
        });
        ctx.restore();
    }

    drawDebugLayerExtensions() {
        this.debugContext.fillText("pos: (" + Math.floor(this.ship.x) + ", " + Math.floor(this.ship.y) + ")", 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText("v: (" + Math.round(this.ship.dx) + ", " + Math.round(this.ship.dy) + ")", 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText("dir: " + Math.floor(this.ship.rotation * 180 / Math.PI), 0, 0, 100);
    }

    get bulletCount() {
        return this.sprites.reduce((prev, curr)=> {
            return prev + (curr instanceof Bullet);
        }, 0);
    }
}

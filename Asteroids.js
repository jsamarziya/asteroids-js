"use strict";

const MAX_DELTA_TIME = 160;
const DEBUG_STYLE = "#BB0000";

class Asteroids {
    constructor(container, gameCanvas, debugCanvas) {
        this.container = container;
        this.gameCanvas = gameCanvas;
        this.debugCanvas = debugCanvas;
        this.gameContext = gameCanvas.getContext("2d");
        this.debugContext = debugCanvas.getContext("2d");
        this.scheduler = new Scheduler();
        this.lastUpdate = 0;
        this.paused = false;
        this.showDebug = false;
        this.drawDebug = false;
        this.inputManager = new InputManager();
        this.ship = this.createShip();
        this.asteroids = [];
        this.stars = this.createStars();
        this.init();

        this.scheduler.schedule(this.createAsteroid.bind(this, 100, 200, 200), 3000);
    }

    init() {
        this.gameContext.strokeStyle = "white";
        this.gameContext.fillStyle = "white";
        this.debugContext.fillStyle = "#A0A0A0";
        this.setScale();
    }

    createShip() {
        const ship = new Ship();
        ship.x = this.gameCanvas.width / 2;
        ship.y = this.gameCanvas.height / 2;
        return ship;
    }

    createAsteroid(size, x, y) {
        const asteroid = new Asteroid(size);
        asteroid.x = x;
        asteroid.y = y;
        // asteroid.dx = (0.5-Math.random() )*10+5;
        // asteroid.dy = (0.5-Math.random() )*10+40;
        asteroid.rpm = (0.5 - Math.random()) * 6;
        this.asteroids.push(asteroid);
        return asteroid;
    }

    createStars() {
        const stars = [];
        const width = this.gameCanvas.width;
        const height = this.gameCanvas.height;
        for (let i = 0; i < 15; i++) {
            stars.push({x: Math.random() * width, y: Math.random() * height});
        }
        return stars;
    }

    setScale() {
        this.scale = this.gameCanvas.width * this.gameCanvas.height / 1000000;
    }

    run() {
        this.requestAnimationFrame();
    }

    requestAnimationFrame() {
        window.requestAnimationFrame(this.update.bind(this));
    }

    update(timestamp) {
        this.requestAnimationFrame();
        const dt = timestamp - this.lastUpdate;
        this.lastUpdate = timestamp;
        if (!this.paused && dt <= MAX_DELTA_TIME) {
            this.updateState(dt);
            this.drawGameLayer();
        }
        this.fps = 1000 / dt;
        if (this.showDebug) {
            this.drawDebugLayer();
        }
    }

    updateState(dt) {
        this.scheduler.advanceTime(dt);
        this.ship.update(dt);
        this.asteroids.forEach(asteroid => {
            asteroid.update(dt);
        });
    }

    drawGameLayer() {
        this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.stars.forEach(star => {
            this.gameContext.fillRect(star.x, star.y, 1, 1);
        });
        this.asteroids.forEach(asteroid => {
            asteroid.draw(this.gameContext, this.scale);
        });
        this.ship.draw(this.gameContext, this.scale);
    }

    drawDebugLayer() {
        this.debugContext.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
        const textY = this.debugCanvas.height - 10;
        this.debugContext.fillText("FPS: " + this.fps.toFixed(3), 10, textY, 100);
        this.debugContext.fillText("pos: (" + Math.floor(this.ship.x) + ", " + Math.floor(this.ship.y) + ")", 100, textY, 100);
        this.debugContext.fillText("v: (" + Math.round(this.ship.dx) + ", " + Math.round(this.ship.dy) + ")", 200, textY, 100);
        this.debugContext.fillText("dir: " + Math.floor(this.ship.rotation * 180 / Math.PI), 300, textY, 100);
    }

    requestFullScreenMode() {
        ( this.container.mozRequestFullScreen && this.container.mozRequestFullScreen() ) ||
        ( this.container.webkitRequestFullScreen && this.container.webkitRequestFullScreen() ) ||
        ( this.container.requestFullScreen && this.container.requestFullScreen());
    }

    togglePaused() {
        this.paused = !this.paused;
    }

    toggleShowDebug() {
        this.showDebug = !this.showDebug;
        this.debugCanvas.style.visibility = this.showDebug ? "visible" : "hidden";
    }

    toggleDrawDebug() {
        this.drawDebug = !this.drawDebug;
    }
}

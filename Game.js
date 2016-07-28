"use strict";

const MAX_DELTA_TIME = 160;
const REFERENCE_DELTA_TIME = 1000 / 60;

class Game {
    constructor(container, gameCanvas, debugCanvas) {
        this.container = container;
        this.gameCanvas = gameCanvas;
        this.debugCanvas = debugCanvas;
        this.gameContext = gameCanvas.getContext("2d");
        this.debugContext = debugCanvas.getContext("2d");
        this.inputManager = new InputManager();
        this.scheduler = new Scheduler();
        this.lastUpdate = 0;
        this.paused = false;
        this.showDebug = false;
        this.drawDebug = false;
        this.sprites = [];
        this.setScale();
        this.initDebugContext();
    }

    initDebugContext() {
        this.debugContext.fillStyle = "#A0A0A0";
    }

    //noinspection JSMethodCanBeStatic
    get drawDebugStyle() {
        return "#BB0000";
    }

    setScale() {
        this.scale = this.gameCanvas.width * this.gameCanvas.height / 1000000;
    }

    start() {
        this.requestAnimationFrame();
    }

    requestAnimationFrame() {
        window.requestAnimationFrame(this.update.bind(this));
    }

    update(timestamp) {
        performance.mark("gameUpdateStart");
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
        performance.mark("gameUpdateEnd");
        performance.measure("gameUpdateElapsed", "gameUpdateStart", "gameUpdateEnd");
        performance.clearMarks("gameUpdateStart");
        performance.clearMarks("gameUpdateEnd");
    }

    updateState(dt) {
        this.scheduler.advanceTime(dt);
        this.sprites.forEach((sprite, index, array) => {
            sprite.update(dt);
            if (sprite.isRemoveFromWorld) {
                array.splice(index, 1);
            }
        });
    }

    drawGameLayer() {
        this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.drawBackground();
        // TODO: sprite needs z-index
        this.sprites.forEach(sprite => {
            sprite.draw();
        });
    }

    // template method
    drawBackground() {
    }

    drawDebugLayer() {
        const gameUpdateElapsed = performance.getEntriesByName("gameUpdateElapsed")[0];
        performance.clearMeasures("gameUpdateElapsed");
        this.debugContext.save();
        this.debugContext.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
        this.debugContext.translate(10, this.debugCanvas.height - 10);
        this.debugContext.fillText("FPS: " + this.fps.toFixed(3), 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.debugContext.fillText("Update: " + gameUpdateElapsed.duration.toFixed(2) + "ms", 0, 0, 100);
        this.debugContext.translate(100, 0);
        this.drawDebugLayerExtensions();
        this.debugContext.restore();
    }

    drawDebugLayerExtensions() {
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

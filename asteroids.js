const MAX_DELTA_TIME = 160;

function Asteroids(container, gameCanvas, debugCanvas) {
    this.container = container;
    this.gameCanvas = gameCanvas;
    this.debugCanvas = debugCanvas;
    this.gameContext = gameCanvas.getContext("2d");
    this.debugContext = debugCanvas.getContext("2d");
    this.lastUpdate = 0;
    this.scale = 1;
    this.paused = false;
    this.showDebug = false;
    this.inputManager = new InputManager();
    this.ship = this.createShip();
    this.init();
}

Asteroids.prototype.init = function () {
    this.gameContext.strokeStyle = "white";
    this.gameContext.translate(this.gameCanvas.width / 2, this.gameCanvas.height / 2);
    this.gameContext.scale(1, -1);
    this.debugContext.fillStyle = "#A0A0A0";
};

Asteroids.prototype.createShip = function () {
    return new Ship();
};

Asteroids.prototype.run = function () {
    this.update();
};

Asteroids.prototype.update = function (timestamp) {
    window.requestAnimationFrame(this.update.bind(this));
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
};

Asteroids.prototype.updateState = function (dt) {
    this.ship.update(dt);
};

Asteroids.prototype.drawGameLayer = function () {
    this.gameContext.clearRect(-this.gameCanvas.width / 2, -this.gameCanvas.height / 2, this.gameCanvas.width, this.gameCanvas.height);
    this.ship.draw(this.gameContext, this.scale);
};

Asteroids.prototype.drawDebugLayer = function () {
    this.debugContext.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
    const textY = this.debugCanvas.height - 10;
    this.debugContext.fillText("FPS: " + this.fps.toFixed(3), 10, textY, 100);
    this.debugContext.fillText("pos: (" + Math.floor(this.ship.x) + ", " + Math.floor(this.ship.y) + ")", 100, textY, 100);
    this.debugContext.fillText("v: (" + Math.round(this.ship.dx) + ", " + Math.round(this.ship.dy) + ")", 200, textY, 100);
    this.debugContext.fillText("dir: " + Math.floor(this.ship.rotation * 180 / Math.PI), 300, textY, 100);
};

Asteroids.prototype.requestFullScreenMode = function () {
    ( this.container.mozRequestFullScreen && this.container.mozRequestFullScreen() ) ||
    ( this.container.webkitRequestFullScreen && this.container.webkitRequestFullScreen() ) ||
    ( this.container.requestFullScreen && this.container.requestFullScreen());
};

Asteroids.prototype.togglePaused = function () {
    this.paused = !this.paused;
};

Asteroids.prototype.toggleShowDebug = function () {
    this.showDebug = !this.showDebug;
    this.debugCanvas.style.visibility = this.showDebug ? "visible" : "hidden";
};

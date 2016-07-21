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
    this.ship = new Ship();
    this.inputManager = new InputManager();
    this.init();
}

Asteroids.prototype.init = function () {
    this.gameContext.strokeStyle = "white";
    this.debugContext.fillStyle = "white";
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
    this.drawDebugLayer();
};

Asteroids.prototype.updateState = function (dt) {
    this.ship.update(dt);
};

Asteroids.prototype.drawGameLayer = function () {
    this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    this.ship.draw(this.gameContext, this.scale);
};

Asteroids.prototype.drawDebugLayer = function () {
    this.debugContext.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
    this.debugContext.fillText("FPS: " + this.fps, 10, this.debugCanvas.height - 10);
};

Asteroids.prototype.requestFullScreenMode = function () {
    ( this.container.mozRequestFullScreen && this.container.mozRequestFullScreen() ) ||
    ( this.container.webkitRequestFullScreen && this.container.webkitRequestFullScreen() ) ||
    ( this.container.requestFullScreen && this.container.requestFullScreen());
};

Asteroids.prototype.togglePaused = function () {
    this.paused = !this.paused;
};
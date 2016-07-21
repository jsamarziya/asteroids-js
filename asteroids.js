const MAX_DELTA_TIME = 160;

function Asteroids(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.lastUpdate = 0;
    this.scale = 1;
    this.paused = false;
    this.ship = new Ship();
    this.inputManager = new InputManager();
    this.init();
}

Asteroids.prototype.init = function () {
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";
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
        this.draw();
    }
    this.fps = 1000 / dt;
    this.drawFPS();
};

Asteroids.prototype.updateState = function (dt) {
    this.ship.update(dt);
};

Asteroids.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ship.draw(this.ctx, this.scale);
};

Asteroids.prototype.drawFPS = function () {
    this.ctx.fillText("FPS: " + this.fps, 10, this.canvas.height - 10);
};

Asteroids.prototype.requestFullScreenMode = function () {
    ( this.canvas.mozRequestFullScreen && this.canvas.mozRequestFullScreen() ) ||
    ( this.canvas.webkitRequestFullScreen && this.canvas.webkitRequestFullScreen() ) ||
    ( this.canvas.requestFullScreen && this.canvas.requestFullScreen());
};

Asteroids.prototype.togglePaused = function () {
    this.paused = !this.paused;
};
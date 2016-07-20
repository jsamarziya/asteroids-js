const MAX_DELTA_TIME = 160;

function Asteroids(window, canvas) {
    this.window = window;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.lastUpdate = 0;
    this.inputManager = new InputManager(window);
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
    this.window.requestAnimationFrame(this.update.bind(this));
    const dt = timestamp - this.lastUpdate;
    this.lastUpdate = timestamp;
    if (dt <= MAX_DELTA_TIME) {
        this.tick(dt);
    }
};

Asteroids.prototype.tick = function (dt) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText("dt: " + dt, 10, 100);
    this.ctx.fillText("keysDown: " + this.inputManager.getKeysDown(), 10, 200);
};
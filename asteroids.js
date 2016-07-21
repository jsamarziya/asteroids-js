const MAX_DELTA_TIME = 160;

function Asteroids(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.lastUpdate = 0;
    this.scale = 1;
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
    if (dt <= MAX_DELTA_TIME) {
        this.tick(dt);
        this.draw();
    }
};

Asteroids.prototype.tick = function (dt) {
    this.fps = 1000 / dt;
    this.ship.update(dt);
};

Asteroids.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText("FPS: " + this.fps, 10, this.canvas.height - 10);
    this.ship.draw(this.ctx, this.scale);
};

Asteroids.prototype.requestFullScreen = function () {
    ( this.canvas.mozRequestFullScreen && this.canvas.mozRequestFullScreen() ) ||
    ( this.canvas.webkitRequestFullScreen && this.canvas.webkitRequestFullScreen() ) ||
    ( this.canvas.requestFullScreen && this.canvas.requestFullScreen());
};
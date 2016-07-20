// The Asteroids game.
function Asteroids(window, canvas) {
    this.window = window;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.lastUpdate = 0;
    this.initCanvas();
}

Asteroids.prototype.initCanvas = function () {
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";
};

Asteroids.prototype.update = function (timestamp) {
    this.window.requestAnimationFrame(this.update.bind(this));
    var delta = timestamp - this.lastUpdate;
    this.lastUpdate = timestamp;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText(delta, 100, 100);
};
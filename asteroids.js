function Asteroids(window, canvas) {
    this.window = window;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.initCanvas();
}

Asteroids.prototype.initCanvas = function () {
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";
};

Asteroids.prototype.update = function (timestamp) {
    this.window.requestAnimationFrame(this.update.bind(this));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText(timestamp, 100, 100);
};
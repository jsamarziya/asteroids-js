const SHIP_ROTATION_INCREMENT = Math.PI / 180 / 8;

function Ship() {
    this.x = 200;
    this.y = 200;
    this.dx = 0;
    this.dy = 0;
    this.rotation = 0;
    this.turnLeft = false;
    this.turnRight = false;
}

Ship.prototype.setTurnLeft = function (turn) {
    this.turnLeft = turn;
};

Ship.prototype.setTurnRight = function (turn) {
    this.turnRight = turn;
};

Ship.prototype.getRotationDelta = function () {
    return ((this.turnRight | 0 ) - (this.turnLeft | 0)) * SHIP_ROTATION_INCREMENT;
};

Ship.prototype.update = function (dt) {
    this.rotation += this.getRotationDelta() * dt;
};

Ship.prototype.draw = function (ctx, scale) {
    ctx.save();
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.moveTo(-20 * scale, 20 * scale);
    ctx.lineTo(scale, -40 * scale);
    ctx.lineTo(20 * scale, 20 * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
};
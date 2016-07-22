const SHIP_ROTATION_INCREMENT = Math.PI / 180 / 7;
const FULL_CIRCLE = 2 * Math.PI;
const SHIP_VELOCITY_FACTOR = 1 / 1000;
const SHIP_MIN_VELOCITY = 1 / 200;
const SHIP_DEACCELERATION_FACTOR = 1 - 1 / 400;

function Ship() {
    this.x = 200;
    this.y = 200;
    this.dx = 0;
    this.dy = 0;
    this.rotation = 0;
    this.turnLeft = false;
    this.turnRight = false;
    this.thrust = false;
}

Ship.prototype.setTurnLeft = function (turn) {
    this.turnLeft = turn;
};

Ship.prototype.setTurnRight = function (turn) {
    this.turnRight = turn;
};

Ship.prototype.setThrust = function (thrust) {
    this.thrust = thrust;
};

Ship.prototype.getRotationDelta = function () {
    return ((this.turnRight | 0 ) - (this.turnLeft | 0)) * SHIP_ROTATION_INCREMENT;
};

Ship.prototype.update = function (dt) {
    this.rotation += this.getRotationDelta() * dt;
    if (this.rotation > FULL_CIRCLE) {
        this.rotation -= FULL_CIRCLE;
    } else if (this.rotation < 0) {
        this.rotation += FULL_CIRCLE;
    }
    if (this.thrust) {
        this.dx += Math.sin(this.rotation);
        this.dy -= Math.cos(this.rotation);
    } else {
        this.dx *= SHIP_DEACCELERATION_FACTOR;
        this.dy *= SHIP_DEACCELERATION_FACTOR;
        if (Math.abs(this.dx) < SHIP_MIN_VELOCITY) {
            this.dx = 0;
        }
        if (Math.abs(this.dy) < SHIP_MIN_VELOCITY) {
            this.dy = 0;
        }
    }
    this.x += this.dx * SHIP_VELOCITY_FACTOR * dt;
    this.y += this.dy * SHIP_VELOCITY_FACTOR * dt;
};

Ship.prototype.draw = function (ctx, scale) {
    ctx.save();
    ctx.translate(Math.floor(this.x * scale), Math.floor(this.y * scale));
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.moveTo(Math.floor(-20 * scale), Math.floor(20 * scale));
    ctx.lineTo(0, Math.floor(-40 * scale));
    ctx.lineTo(Math.floor(20 * scale), Math.floor(20 * scale));
    ctx.lineTo(0, Math.floor(10 * scale));
    ctx.lineTo(Math.floor(-20 * scale), Math.floor(20 * scale));
    if (this.thrust && Math.random() > 0.7) {
        ctx.moveTo(Math.floor(-10 * scale), Math.floor(15 * scale));
        ctx.lineTo(0, Math.floor((Math.random() * 15 + 35) * scale));
        ctx.lineTo(Math.floor(10 * scale), Math.floor(15 * scale));
    }
    ctx.stroke();
    ctx.restore();
};
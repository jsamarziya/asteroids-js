"use strict";

const SHIP_DECELERATION = 1 - 1 / 400;
const SHIP_RPM = 23;
const MAX_BULLETS = 4;

class Ship extends Sprite {
    constructor(game) {
        super(game);
        this.turnLeft = false;
        this.turnRight = false;
        this.thrust = false;
        this.thrustDrawChance = 0;
        this.shotTaken = false;
    }

    setTurnLeft(turn) {
        this.turnLeft = turn;
    }

    setTurnRight(turn) {
        this.turnRight = turn;
    }

    setThrust(thrust) {
        this.thrust = thrust;
        this.thrustDrawChance = thrust | 0;
    }

    shoot() {
        this.shotTaken = true;
    }

    get rpm() {
        return ((this.turnRight | 0 ) - (this.turnLeft | 0)) * SHIP_RPM;
    }

    update(dt) {
        const timeUnits = dt / REFERENCE_DELTA_TIME;
        if (this.thrust) {
            this.dx += Math.sin(this.rotation) * timeUnits * 5;
            this.dy -= Math.cos(this.rotation) * timeUnits * 5;
        } else {
            this.dx *= Math.pow(SHIP_DECELERATION, timeUnits);
            this.dy *= Math.pow(SHIP_DECELERATION, timeUnits);
        }
        if (this.shotTaken) {
            this.shotTaken = false;
            this.addBullet();
        }
        super.update(dt)
    }

    drawSprite() {
        const ctx = this.game.gameContext;
        ctx.beginPath();
        ctx.moveTo(Math.floor(this.game.getScaledWidth(-40)), Math.floor(this.game.getScaledHeight(40)));
        ctx.lineTo(0, Math.floor(this.game.getScaledHeight(-80)));
        ctx.lineTo(Math.floor(this.game.getScaledWidth(40)), Math.floor(this.game.getScaledHeight(40)));
        ctx.lineTo(0, Math.floor(this.game.getScaledHeight(20)));
        ctx.lineTo(Math.floor(this.game.getScaledWidth(-40)), Math.floor(this.game.getScaledHeight(40)));
        ctx.fill();
        if (this.thrust && Math.random() < this.thrustDrawChance) {
            ctx.moveTo(Math.floor(this.game.getScaledWidth(-20)), Math.floor(this.game.getScaledHeight(30)));
            ctx.lineTo(0, Math.floor(this.game.getScaledHeight(Math.random() * 40 + 60)));
            ctx.lineTo(Math.floor(this.game.getScaledWidth(20)), Math.floor(this.game.getScaledHeight(30)));
            this.thrustDrawChance = 0.3;
        }
        ctx.stroke();
    }

    addBullet() {
        if (this.game.bulletCount < MAX_BULLETS) {
            const dx = Math.sin(this.rotation);
            const dy = -Math.cos(this.rotation);
            const bullet = new Bullet(this.game);
            bullet.x = this.x + Math.floor(dx * 80);
            bullet.y = this.y + Math.floor(dy * 80);
            bullet.dx = dx * BULLET_SPEED;
            bullet.dy = dy * BULLET_SPEED;
            this.game.sprites.push(bullet);
        }
    }
}

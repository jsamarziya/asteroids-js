"use strict";

const SHIP_MIN_VELOCITY = 1 / 200;
const SHIP_DECELERATION_FACTOR = 1 - 1 / 400;
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
        if (this.thrust) {
            this.dx += Math.sin(this.rotation);
            this.dy -= Math.cos(this.rotation);
        } else {
            this.dx *= SHIP_DECELERATION_FACTOR;
            this.dy *= SHIP_DECELERATION_FACTOR;
            if (Math.abs(this.dx) < SHIP_MIN_VELOCITY) {
                this.dx = 0;
            }
            if (Math.abs(this.dy) < SHIP_MIN_VELOCITY) {
                this.dy = 0;
            }
        }
        if (this.shotTaken) {
            this.shotTaken = false;
            this.addBullet();
        }
        super.update(dt)
    }

    drawSprite() {
        const ctx = this.game.gameContext;
        const scale = this.game.scale;
        ctx.beginPath();
        ctx.moveTo(Math.floor(-20 * scale), Math.floor(20 * scale));
        ctx.lineTo(0, Math.floor(-40 * scale));
        ctx.lineTo(Math.floor(20 * scale), Math.floor(20 * scale));
        ctx.lineTo(0, Math.floor(10 * scale));
        ctx.lineTo(Math.floor(-20 * scale), Math.floor(20 * scale));
        ctx.fill();
        if (this.thrust && Math.random() < this.thrustDrawChance) {
            ctx.moveTo(Math.floor(-10 * scale), Math.floor(15 * scale));
            ctx.lineTo(0, Math.floor((Math.random() * 15 + 35) * scale));
            ctx.lineTo(Math.floor(10 * scale), Math.floor(15 * scale));
            this.thrustDrawChance = 0.3;
        }
        ctx.stroke();
    }

    addBullet() {
        if (this.game.bulletCount < MAX_BULLETS) {
            const dx = Math.sin(this.rotation);
            const dy = -Math.cos(this.rotation);
            const bullet = new Bullet(this.game);
            bullet.x = this.x + Math.floor(dx * 40 * this.game.scale);
            bullet.y = this.y + Math.floor(dy * 40 * this.game.scale);
            bullet.dx = dx * BULLET_SPEED;
            bullet.dy = dy * BULLET_SPEED;
            this.game.sprites.push(bullet);
        }
    }
}

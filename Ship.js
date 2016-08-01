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
            // distance, in reference units, from the origin to the tip of the ship
            const offset = 40 * this.game.scale * 5;
            const bullet = new Bullet(this.game);
            bullet.x = this.x + Math.floor(dx * offset);
            bullet.y = this.y + Math.floor(dy * offset);
            bullet.dx = dx * BULLET_SPEED;
            bullet.dy = dy * BULLET_SPEED;
            this.game.sprites.push(bullet);
        }
    }
}
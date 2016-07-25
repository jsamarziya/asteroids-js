"use strict";

const SHIP_ROTATION_INCREMENT = Math.PI / 180 / 7;
const SHIP_MIN_VELOCITY = 1 / 200;
const SHIP_DECELERATION_FACTOR = 1 - 1 / 400;

class Ship extends Sprite {
    constructor() {
        super();
        this.turnLeft = false;
        this.turnRight = false;
        this.thrust = false;
        this.thrustDrawChance = 0;
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

    getRotationDelta() {
        return ((this.turnRight | 0 ) - (this.turnLeft | 0)) * SHIP_ROTATION_INCREMENT;
    }

    update(dt) {
        this.rotation += this.getRotationDelta() * dt;
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
        super.update(dt)
    }

    drawSprite(ctx, scale) {
        ctx.beginPath();
        ctx.moveTo(Math.floor(-20 * scale), Math.floor(20 * scale));
        ctx.lineTo(0, Math.floor(-40 * scale));
        ctx.lineTo(Math.floor(20 * scale), Math.floor(20 * scale));
        ctx.lineTo(0, Math.floor(10 * scale));
        ctx.lineTo(Math.floor(-20 * scale), Math.floor(20 * scale));
        if (this.thrust && Math.random() < this.thrustDrawChance) {
            ctx.moveTo(Math.floor(-10 * scale), Math.floor(15 * scale));
            ctx.lineTo(0, Math.floor((Math.random() * 15 + 35) * scale));
            ctx.lineTo(Math.floor(10 * scale), Math.floor(15 * scale));
            this.thrustDrawChance = 0.3;
        }
        ctx.stroke();
    }
}


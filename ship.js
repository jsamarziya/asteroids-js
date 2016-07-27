"use strict";

const SHIP_MIN_VELOCITY = 1 / 200;
const SHIP_DECELERATION_FACTOR = 1 - 1 / 400;
const SHIP_RPM = 23;
const MAX_BULLETS = 5;

class Ship extends Sprite {
    constructor() {
        super();
        this.turnLeft = false;
        this.turnRight = false;
        this.thrust = false;
        this.thrustDrawChance = 0;
        this.bullets = [];
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
        this.updateBullets(dt);
        super.update(dt)
    }

    updateBullets(dt) {
        this.bullets.forEach((bullet, index, array) => {
            bullet.update(dt);
            if (bullet.isExpired()) {
                array.splice(index, 1);
            }
        });
        if (this.shotTaken) {
            this.shotTaken = false;
            this.addBullet();
        }
    }

    draw(ctx, scale) {
        this.drawBullets(ctx);
        super.draw(ctx, scale);
    }

    drawSprite(ctx, scale) {
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

    drawBullets(ctx) {
        this.bullets.forEach(bullet=> {
            bullet.draw(ctx);
        });
    }

    addBullet() {
        if (this.bullets.length < MAX_BULLETS) {
            let dx = Math.sin(this.rotation);
            let dy = -Math.cos(this.rotation);
            // TODO fix this - should not reference asteroids.scale
            let x = this.x + Math.floor(dx * 40 * asteroids.scale);
            let y = this.y + Math.floor(dy * 40 * asteroids.scale);
            let bullet = new Bullet(x, y, dx * BULLET_SPEED, dy * BULLET_SPEED);
            this.bullets.push(bullet);
        }
    }
}

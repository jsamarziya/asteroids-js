"use strict";

const FULL_CIRCLE = 2 * Math.PI;
const SPRITE_VELOCITY_FACTOR = 1 / 1000;
const ROTATION_PER_MILLISECOND = FULL_CIRCLE / 60 / 1000;

class Sprite {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.rotation = 0;
        this._rpm = 0;
    }

    update(dt) {
        this.rotation += this.rpm * dt * ROTATION_PER_MILLISECOND;
        if (this.rotation > FULL_CIRCLE) {
            this.rotation -= FULL_CIRCLE;
        } else if (this.rotation < 0) {
            this.rotation += FULL_CIRCLE;
        }
        this.x += this.dx * SPRITE_VELOCITY_FACTOR * dt;
        this.y += this.dy * SPRITE_VELOCITY_FACTOR * dt;
    }

    get rpm() {
        return this._rpm;
    }

    set rpm(rpm) {
        this._rpm = rpm;
    }

    get scaledX() {
        return this.game.getScaledWidth(this.x);
    }

    get scaledY() {
        return this.game.getScaledHeight(this.y);
    }

    draw() {
        const ctx = this.game.gameContext;
        ctx.save();
        ctx.translate(this.scaledX, this.scaledY);
        ctx.rotate(this.rotation);
        this.drawSprite();
        ctx.restore();
    }
}

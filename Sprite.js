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
        this.radius = 0;
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
        if (this.x < 0) {
            this.x += REFERENCE_WIDTH;
        } else if (this.x > REFERENCE_WIDTH) {
            this.x -= REFERENCE_WIDTH;
        }
        if (this.y < 0) {
            this.y += REFERENCE_HEIGHT;
        } else if (this.y > REFERENCE_HEIGHT) {
            this.y -= REFERENCE_HEIGHT;
        }
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
        ctx.save();
        ctx.rotate(this.rotation);
        this.drawInternal();
        ctx.restore();

        let wraparound = false;
        if (this.x - this.radius < 0) {
            ctx.translate(this.game.getScaledWidth(REFERENCE_WIDTH), 0);
            wraparound = true;
        } else if (this.x + this.radius > REFERENCE_WIDTH) {
            ctx.translate(this.game.getScaledWidth(-REFERENCE_WIDTH), 0);
            wraparound = true;
        }
        if (this.y - this.radius < 0) {
            ctx.translate(0, this.game.getScaledHeight(REFERENCE_HEIGHT));
            wraparound = true;
        } else if (this.y + this.radius > REFERENCE_HEIGHT) {
            ctx.translate(0, this.game.getScaledHeight(-REFERENCE_HEIGHT));
            wraparound = true;
        }
        if (wraparound) {
            ctx.rotate(this.rotation);
            this.drawInternal();
        }
        ctx.restore();
    }

    drawInternal() {
        this.drawSprite();
        if (this.game.drawDebug) {
            const ctx = this.game.gameContext;
            ctx.save();
            ctx.strokeStyle = this.game.drawDebugStyle;
            ctx.beginPath();
            ctx.arc(0, 0, Math.floor(this.game.getScaledHeight(this.radius)), 0, FULL_CIRCLE);
            ctx.stroke();
            ctx.restore();
        }
    }
}

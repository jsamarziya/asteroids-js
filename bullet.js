"use strict";

const BULLET_SPEED = 400;

class Bullet extends Sprite {
    constructor(x, y, dx, dy) {
        super();
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.timeRemaining = 1500;
    }

    isExpired() {
        return this.timeRemaining <= 0;
    }

    update(dt) {
        this.timeRemaining -= dt;
        if (!this.isExpired()) {
            super.update(dt);
        }
    }

    //noinspection JSMethodCanBeStatic
    drawSprite(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 2, 2);
        ctx.restore();
    }
}

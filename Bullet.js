"use strict";

const BULLET_SPEED = 2000;

class Bullet extends Sprite {
    constructor(game) {
        super(game);
        this.timeRemaining = 1500;
    }

    update(dt) {
        this.timeRemaining -= dt;
        if (this.timeRemaining > 0) {
            super.update(dt);
        } else {
            this.isRemoveFromWorld = true;
        }
    }

    drawSprite(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 2, 2);
        ctx.restore();
    }
}

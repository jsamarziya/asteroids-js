"use strict";

/**
 * The speed of a bullet.
 * @type {number}
 */
const BULLET_SPEED = 2000;

/**
 * The bullet sprite.
 */
class Bullet extends Sprite {
    /**
     * Constructs a new Bullet.
     * @param {Game} game the Game to which the sprite will belong
     */
    constructor(game) {
        super(game);
        this.timeRemaining = 1200;
        this.hitRegion = new SAT.Vector(super.x, super.y);
    }

    /**
     * @override
     * @inheritDoc
     */
    get x() {
        return this.hitRegion.x;
    }

    /**
     * @override
     * @inheritDoc
     */
    set x(x) {
        this.hitRegion.x = x;
    }

    /**
     * @override
     * @inheritDoc
     */
    get y() {
        return this.hitRegion.y;
    }

    /**
     * @override
     * @inheritDoc
     */
    set y(y) {
        this.hitRegion.y = y;
    }

    /**
     * @override
     * @inheritDoc
     */
    update(dt) {
        this.timeRemaining -= dt;
        if (this.timeRemaining > 0) {
            super.update(dt);
        } else {
            this.isRemoveFromWorld = true;
        }
    }

    /**
     * @override
     * @inheritDoc
     */
    drawSprite(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 2, 2);
        ctx.restore();
    }

    /**
     * @inheritDoc
     * @override
     */
    canCollideWith(sprite) {
        return sprite instanceof Asteroid;
    }
}

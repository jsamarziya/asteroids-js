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
        this.hitRegion = new SAT.Polygon(new SAT.Vector(0, 0), [
            new SAT.Vector(0, 0),
            new SAT.Vector(0, BULLET_SPEED * SPRITE_VELOCITY_FACTOR * REFERENCE_DELTA_TIME)
        ]);
        this.boundingRegions = [this.hitRegion];
    }

    /**
     * @override
     * @inheritDoc
     */
    get x() {
        return this.hitRegion.pos.x;
    }

    /**
     * @override
     * @inheritDoc
     */
    set x(x) {
        this.hitRegion.pos.x = x;
    }

    /**
     * @override
     * @inheritDoc
     */
    get y() {
        return this.hitRegion.pos.y;
    }

    /**
     * @override
     * @inheritDoc
     */
    set y(y) {
        this.hitRegion.pos.y = y;
    }

    /**
     * @override
     * @inheritDoc
     */
    get z() {
        return 99;
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

    /**
     * @inheritDoc
     * @override
     */
    collisionDetected(sprite) {
        this.game.removeSprite(this);
        this.game.objectDestroyedByPlayer(sprite);
    }
}

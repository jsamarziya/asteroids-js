"use strict";

/**
 * The maximum speed of a shrapnel.
 * @type {number}
 */
const MAX_SHRAPNEL_SPEED = 500;

/**
 * The shrapnel sprite.
 */
class Shrapnel extends Sprite {
    /**
     * Constructs a new Shrapnel.
     * @param {Game} game the Game to which the sprite will belong
     */
    constructor(game) {
        super(game);
    }

    /**
     * @override
     * @inheritDoc
     */
    get z() {
        return 100;
    }

    /**
     * @override
     * @inheritDoc
     */
    drawSprite(ctx) {
        ctx.save();
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(0, 0, 1, 1);
        ctx.restore();
    }

    /**
     * @inheritDoc
     * @override
     */
    canCollideWith(sprite) {
        return false;
    }

    /**
     * Creates an explosion.
     * @param {Game} game the Game to add the explosion to
     * @param {number} size the size of the explosion
     * @param {number} x the x-coordinate of the position of the explosion
     * @param {number} y the y-coordinate of the position of the explosion
     */
    static createExplosion(game, size, x, y) {
        for (let i = 0; i < 10; i++) {
            const shrapnel = new Shrapnel(game);
            shrapnel.timeRemaining = Math.max((Math.random() * 3 + 1) * size, 300);
            const direction = Math.random() * FULL_CIRCLE;
            const speed = MAX_SHRAPNEL_SPEED * (Math.random() * 0.75 + 0.25);
            shrapnel.x = x;
            shrapnel.y = y;
            shrapnel.dx = speed * Math.cos(direction);
            shrapnel.dy = speed * Math.sin(direction);
            game.addSprite(shrapnel);
        }
    }

}

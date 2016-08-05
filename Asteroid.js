"use strict";

/**
 * The number of radii created by {@link Asteroid#createRadii}.
 * @type {number}
 */
const ASTEROID_RADII = 11;
/**
 * The amount (in radians) that the context is rotated between each segment drawn.
 * @type {number}
 */
const ASTEROID_SEGMENT_ROTATION = FULL_CIRCLE / ASTEROID_RADII / 2;
/**
 * The size of a large asteroid.
 * @type {number}
 */
const ASTEROID_SIZE_LARGE = 230;

/**
 * The asteroid sprite.
 */
class Asteroid extends Sprite {
    /**
     * Constructs a new Asteroid.
     * @param {Game} game the Game to which the sprite will belong
     * @param {number} size the size (radius) of the asteroid
     */
    constructor(game, size) {
        super(game);
        this.radius = size;
        this.radii = this.createRadii();
    }

    /**
     * Creates the radii of the segments of this asteroid.
     * @returns {number[]} the radii
     */
    createRadii() {
        const radii = [];
        for (let i = 0; i < ASTEROID_RADII; i++) {
            const radius = (1 - Math.random() * 0.5) * this.radius;
            radii.push(radius);
        }
        return radii;
    }

    /**
     * @inheritDoc
     * @override
     */
    drawSprite(ctx) {
        ctx.beginPath();
        this.radii.forEach(radius => {
                for (let i = 0; i < 2; i++) {
                    ctx.rotate(ASTEROID_SEGMENT_ROTATION);
                    ctx.lineTo(0, Math.floor(this.game.getScaledHeight(radius)));
                }
            }
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        if (this.game.drawDebug) {
            ctx.save();
            ctx.strokeStyle = this.game.drawDebugStyle;
            ctx.beginPath();
            this.radii.forEach(radius => {
                    for (let i = 0; i < 2; i++) {
                        ctx.rotate(ASTEROID_SEGMENT_ROTATION);
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, Math.floor(this.game.getScaledHeight(radius)));
                    }
                }
            );
            ctx.stroke();
            ctx.restore();
        }
    }

    /**
     * @inheritDoc
     * @override
     */
    canCollideWith(sprite) {
        return sprite instanceof Ship || sprite instanceof Bullet;
    }
}


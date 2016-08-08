"use strict";

/**
 * The number of radii created by {@link Asteroid#createRadii}.
 * @type {number}
 */
const ASTEROID_RADII = 9;
/**
 * The amount (in radians) that the context is rotated between each segment drawn.
 * @type {number}
 */
const ASTEROID_SEGMENT_ROTATION = FULL_CIRCLE / ASTEROID_RADII;
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
        this.legLength = this.radius / ASTEROID_RADII * 2;
        this.hitRegion = new SAT.Circle(new SAT.Vector(super.x, super.y), this.radius);
        this.boundingRegions = this.createBoundingRegions();
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
     * Creates the bounding regions of this asteroid.
     * @return {[SAT.Polygon]} the bounding regions
     */
    createBoundingRegions() {
        // TODO implement me
        return [new SAT.Circle(new SAT.Vector(super.x, super.y), this.radius)];
    }

    /**
     * @inheritDoc
     * @override
     */
    update(dt) {
        super.update(dt);
        this.collision = false;
    }

    /**
     * @inheritDoc
     * @override
     */
    drawSprite(ctx) {
        const legLength = Math.floor(this.game.getScaledWidth(this.legLength));
        ctx.beginPath();
        if (this.collision) {
            ctx.strokeStyle = "red";
        }
        this.radii.forEach(radius => {
                const scaledRadius = Math.floor(this.game.getScaledHeight(radius));
                ctx.rotate(ASTEROID_SEGMENT_ROTATION);
                ctx.lineTo(0, scaledRadius);
                ctx.lineTo(-legLength, scaledRadius);
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
                    const scaledRadius = Math.floor(this.game.getScaledHeight(radius));
                    ctx.rotate(ASTEROID_SEGMENT_ROTATION);
                    ctx.moveTo(0, scaledRadius);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(-legLength, scaledRadius);
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

    /**
     * @inheritDoc
     * @override
     */
    collisionDetected(sprite) {
        this.collision = true;
    }
}

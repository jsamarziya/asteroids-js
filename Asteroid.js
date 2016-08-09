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
 * The unit width of one asteroid slice.
 * @type {number}
 */
const SLICE_UNIT_WIDTH = Math.sin(ASTEROID_SEGMENT_ROTATION);
/**
 * The unit height of one asteroid slice.
 * @type {number}
 */
const SLICE_UNIT_HEIGHT = Math.cos(ASTEROID_SEGMENT_ROTATION);
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
            const radius = (1 - Math.random() * 0.4) * this.radius;
            radii.push(radius);
        }
        return radii;
    }

    /**
     * Creates the bounding regions of this asteroid.
     * @return {[SAT.Polygon]} the bounding regions
     */
    createBoundingRegions() {
        const regions = [];
        let angle = 0;
        for (let i = 0; i < ASTEROID_RADII; i++) {
            regions.push(new SAT.Polygon(new SAT.Vector(0, 0), [
                new SAT.Vector(0, 0),
                new SAT.Vector(0, this.radii[i]),
                new SAT.Vector(-SLICE_UNIT_WIDTH * this.radii[i], SLICE_UNIT_HEIGHT * this.radii[i])
            ]).rotate(angle));
            angle += ASTEROID_SEGMENT_ROTATION;
            regions.push(new SAT.Polygon(new SAT.Vector(0, 0), [
                new SAT.Vector(0, 0),
                new SAT.Vector(0, this.radii[i]),
                new SAT.Vector(-SLICE_UNIT_WIDTH * this.radii[(i + 1) % ASTEROID_RADII],
                    SLICE_UNIT_HEIGHT * this.radii[(i + 1) % ASTEROID_RADII]),
            ]).rotate(angle));
            angle += ASTEROID_SEGMENT_ROTATION;
        }
        return regions;
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
        ctx.beginPath();
        if (this.collision) {
            ctx.strokeStyle = "red";
        }
        this.radii.forEach(radius => {
                for (let i = 0; i < 2; i++) {
                    ctx.lineTo(0, Math.floor(this.game.getScaledHeight(radius)));
                    ctx.rotate(ASTEROID_SEGMENT_ROTATION);
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
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, Math.floor(this.game.getScaledHeight(radius)));
                        ctx.rotate(ASTEROID_SEGMENT_ROTATION);
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

    /**
     * @inheritDoc
     * @override
     */
    collisionDetected(sprite) {
        this.collision = true;
    }
}

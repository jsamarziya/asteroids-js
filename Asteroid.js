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

const ASTEROID_TYPE = {};
ASTEROID_TYPE.SMALL = {size: 57, children: 0, child: null, speedMultiplier: 2};
ASTEROID_TYPE.MEDIUM = {size: 115, children: 2, child: ASTEROID_TYPE.SMALL, speedMultiplier: 2};
ASTEROID_TYPE.LARGE = {size: 230, children: 2, child: ASTEROID_TYPE.MEDIUM};

/**
 * The asteroid sprite.
 */
class Asteroid extends Sprite {
    /**
     * Constructs a new Asteroid.
     * @param {Game} game the Game to which the sprite will belong
     * @param {Object} type the asteroid type
     */
    constructor(game, type) {
        super(game);
        this.type = type;
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
     * @override
     * @inheritDoc
     */
    get radius() {
        return this.type.size;
    }

    /**
     * Creates the radii of the segments of this asteroid.
     * @returns {number[]} the radii
     */
    createRadii() {
        const radii = [];
        for (let i = 0; i < ASTEROID_RADII; i++) {
            radii.push((1 - Math.random() * 0.4) * this.radius);
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
    drawSprite(ctx) {
        ctx.beginPath();
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
        // TODO add explosion
        this.spawnChildren();
        this.removeFromWorld = true;
    }

    /**
     * Creates new children of this sprite.
     */
    spawnChildren() {
        if (this.type.children <= 0) {
            return;
        }
        const myDirection = this.direction;
        const speed = this.speed * this.type.child.speedMultiplier;
        for (let i = 0; i < this.type.children; i++) {
            const child = new Asteroid(this.game, this.type.child);
            child.x = this.x;
            child.y = this.y;
            child.dx = Math.cos(myDirection) * speed;
            child.dy = Math.sin(myDirection) * speed;
            // TODO set dx, dy (calculate current direction, select random angle 20-180 deg, select random speed multiplier)
            // TODO set RPM of each child so as to conserve angular momentum?
            child.rpm = (0.5 - Math.random()) * 8;
            this.game.sprites.push(child);
        }
    }
}

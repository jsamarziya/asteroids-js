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
 * The minimum directional spread of spawned child asteroids.
 * @type {number} the minimum spread (in radians)
 */
const MIN_SPREAD = toRadians(20);
/**
 * The maximum directional spread of spawned child asteroids.
 * @type {number} the maximum spread (in radians)
 */
const MAX_SPREAD = toRadians(150);

const ASTEROID_TYPE = {};
ASTEROID_TYPE.SMALL = {
    size: 57,
    z: 2,
    children: 0,
    child: null,
    speedMultiplier: 1.5,
    points: 100,
    sound: 'explosion1'
};
ASTEROID_TYPE.MEDIUM = {
    size: 115,
    z: 1,
    children: 2,
    child: ASTEROID_TYPE.SMALL,
    speedMultiplier: 2,
    points: 50,
    sound: 'explosion1'
};
ASTEROID_TYPE.LARGE = {
    size: 230,
    z: 0,
    children: 2,
    child: ASTEROID_TYPE.MEDIUM,
    points: 20,
    sound: 'explosion2'
};

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
    get z() {
        return this.type.z;
    }

    /**
     * @override
     * @inheritDoc
     */
    get radius() {
        return this.type.size;
    }

    /**
     * Returns the point value of this asteroid.
     * @return {number} the point value
     */
    get points() {
        return this.type.points;
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
        Shrapnel.createExplosion(this.game, this.radius, this.x, this.y);
        this.game.audioManager.play(this.type.sound);
        this.spawnChildren();
        this.game.removeSprite(this);
    }

    /**
     * Creates new children of this sprite.
     */
    spawnChildren() {
        if (this.type.children < 1) {
            return;
        }
        const speed = this.speed * this.type.child.speedMultiplier;
        const myDirection = this.direction;
        const spread = Math.max(Math.random() * MAX_SPREAD, MIN_SPREAD);
        for (let i = 0; i < this.type.children; i++) {
            const child = new Asteroid(this.game, this.type.child);
            child.x = this.x;
            child.y = this.y;
            const direction = myDirection + (i / Math.max(this.type.children - 1, 1) - 0.5) * spread;
            child.dx = Math.cos(direction) * speed;
            child.dy = Math.sin(direction) * speed;
            child.rpm = (0.5 - Math.random()) * 20;
            this.game.addSprite(child);
        }
    }
}

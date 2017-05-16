"use strict";

/**
 * The amount the ship speed decreases each reference time unit.
 * @type {number}
 */
const SHIP_DECELERATION = 1 - 1 / 400;
/**
 * The number of rotations per minute the ship rotates while turning.
 * @type {number}
 */
const SHIP_RPM = 30;
/**
 * The maximum number of bullets allowed at any given time.
 * @type {number}
 */
const MAX_BULLETS = 4;
/**
 * The amount of time (in milliseconds) that a hyperspace jump lasts.
 * @type {number}
 */
const HYPERSPACE_DELAY = 3000;

/**
 * The ship sprite.
 */
class Ship extends Sprite {
    /**
     * Constructs a new Ship.
     * @param {Game} game the Game to which the sprite will belong
     */
    constructor(game) {
        super(game);
        this.turnLeft = false;
        this.turnRight = false;
        this.thrust = false;
        this.thrustDrawChance = 0;
        this.shotTaken = false;
        this.hitRegion = new SAT.Circle(new SAT.Vector(super.x, super.y), this.radius);
        this.boundingRegions = Ship.createBoundingRegions();
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
        return 98;
    }

    /**
     * @override
     * @inheritDoc
     */
    get radius() {
        return 80;
    }

    /**
     * @override
     * @inheritDoc
     */
    get visible() {
        return !this.hyperspaceInitiated;
    }

    /**
     * Sets the flag which indicates that the ship is turning left.
     * @param {boolean} turn true if turning left, false if not
     */
    setTurnLeft(turn) {
        this.turnLeft = turn;
    }

    /**
     * Sets the flag which indicates that the ship is turning right.
     * @param {boolean} turn true if turning right, false if not
     */
    setTurnRight(turn) {
        this.turnRight = turn;
    }

    /**
     * Sets the flag which indicates that the ship is thrusting.
     * @param {boolean} thrust true if thrusting, false if not
     */
    setThrust(thrust) {
        this.thrust = thrust;
        this.thrustDrawChance = thrust | 0;
    }

    /**
     * Sets the flag which indicates that a shot is being taken.
     */
    shoot() {
        if (!this.hyperspaceInitiated) {
            this.shotTaken = true;
        }
    }

    /**
     * Sets the flag which indicates that hyperspace has been initiated.
     */
    initiateHyperspace() {
        this.hyperspaceInitiated = true;
    }

    /**
     * @override
     * @inheritDoc
     */
    get rpm() {
        return this.hyperspaceInitiated ? 0 : ((this.turnRight | 0 ) - (this.turnLeft | 0)) * SHIP_RPM;
    }

    /**
     * @override
     * @inheritDoc
     */
    update(dt) {
        if (this.hyperspaceInitiated) {
            this.doHyperspaceUpdate(dt);
        } else {
            this.doNormalUpdate(dt);
        }
        super.update(dt)
    }

    /**
     * Updates the state of this ship when the ship is in hyperspace.
     * @param {number} dt the time delta
     */
    doHyperspaceUpdate(dt) {
        if (this.hyperspaceTimeRemaining) {
            this.hyperspaceTimeRemaining -= dt;
            if (this.hyperspaceTimeRemaining <= 0) {
                delete this.hyperspaceTimeRemaining;
                this.hyperspaceInitiated = false;
            }
        } else {
            this.hyperspaceTimeRemaining = HYPERSPACE_DELAY;
            this.x = Math.random() * REFERENCE_WIDTH;
            this.y = Math.random() * REFERENCE_HEIGHT;
            this.dx = 0;
            this.dy = 0;
        }
    }

    /**
     * Updates the state of this ship when the ship is not in hyperspace.
     * @param {number} dt the time delta
     */
    doNormalUpdate(dt) {
        const timeUnits = dt / REFERENCE_DELTA_TIME;
        if (this.thrust) {
            this.dx += Math.sin(this.rotation) * timeUnits * 5;
            this.dy -= Math.cos(this.rotation) * timeUnits * 5;
        } else {
            this.dx *= Math.pow(SHIP_DECELERATION, timeUnits);
            this.dy *= Math.pow(SHIP_DECELERATION, timeUnits);
        }
        if (this.shotTaken) {
            this.shotTaken = false;
            this.addBullet();
        }
        this.drawThrust = this.thrust && Math.random() < this.thrustDrawChance;
        if (this.drawThrust) {
            this.thrustDrawChance = 0.3;
            this.thrustLength = Math.random();
        }
    }

    /**
     * @override
     * @inheritDoc
     */
    drawSprite(ctx) {
        ctx.beginPath();
        ctx.moveTo(Math.floor(this.game.getScaledWidth(-40)), Math.floor(this.game.getScaledHeight(40)));
        ctx.lineTo(0, Math.floor(this.game.getScaledHeight(-80)));
        ctx.lineTo(Math.floor(this.game.getScaledWidth(40)), Math.floor(this.game.getScaledHeight(40)));
        ctx.lineTo(0, Math.floor(this.game.getScaledHeight(20)));
        ctx.lineTo(Math.floor(this.game.getScaledWidth(-40)), Math.floor(this.game.getScaledHeight(40)));
        ctx.fill();
        if (this.drawThrust) {
            ctx.moveTo(Math.floor(this.game.getScaledWidth(-20)), Math.floor(this.game.getScaledHeight(30)));
            ctx.lineTo(0, Math.floor(this.game.getScaledHeight(this.thrustLength * 40 + 60)));
            ctx.lineTo(Math.floor(this.game.getScaledWidth(20)), Math.floor(this.game.getScaledHeight(30)));
        }
        ctx.stroke();
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
        this.game.objectDestroyedByPlayer(sprite);
        this.game.removeSprite(this);
    }

    /**
     * Creates a bullet and adds it to the world.
     */
    addBullet() {
        if (this.game.getSpriteCount(Bullet) < MAX_BULLETS) {
            const dx = Math.sin(this.rotation);
            const dy = -Math.cos(this.rotation);
            const bullet = new Bullet(this.game);
            bullet.x = this.x + Math.floor(dx * 80);
            bullet.y = this.y + Math.floor(dy * 80);
            bullet.dx = dx * BULLET_SPEED;
            bullet.dy = dy * BULLET_SPEED;
            this.game.addSprite(bullet);
            this.game.sounds.bullet.play();
        }
    }

    /**
     * Creates the bounding regions of a ship.
     * @return {[SAT.Polygon]} the bounding regions
     */
    static createBoundingRegions() {
        return [
            new SAT.Polygon(new SAT.Vector(0, 0), [
                new SAT.Vector(0, 20),
                new SAT.Vector(-40, 40),
                new SAT.Vector(0, -80)
            ]),
            new SAT.Polygon(new SAT.Vector(0, 0), [
                new SAT.Vector(0, 20),
                new SAT.Vector(0, -80),
                new SAT.Vector(40, 40)
            ])
        ];
    }
}

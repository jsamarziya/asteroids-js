"use strict";

/**
 * The number of radians in a full circle.
 * @type {number}
 */
const FULL_CIRCLE = 2 * Math.PI;
/**
 * The factor used to calculate the distance traveled by a sprite in one millisecond.
 * @type {number}
 */
const SPRITE_VELOCITY_FACTOR = 1 / 1000;
/**
 * The number of radians rotated in one millisecond by a sprite rotating at one rotation per minute.
 * @type {number}
 */
const ROTATION_PER_MILLISECOND = FULL_CIRCLE / 60 / 1000;

/**
 * The sprite object.
 */
class Sprite {
    /**
     * Constructs a new Sprite.
     *
     * @param {Game} game the Game to which the sprite will belong
     */
    constructor(game) {
        this.game = game;
        this._x = 0;
        this._y = 0;
        this.dx = 0;
        this.dy = 0;
        this.rotation = 0;
        this._rpm = 0;
        this.radius = 0;
    }

    /**
     * Returns the x-coordinate of this sprite's position.
     * @return {number} the x-coordinate
     */
    get x() {
        return this._x;
    }

    /**
     * Sets the x-coordinate of this sprite's position.
     * @param {number} x the x-coordinate
     */
    set x(x) {
        this._x = x;
    }

    /**
     * Returns the y-coordinate of this sprite's position.
     * @return {number} the y-coordinate
     */
    get y() {
        return this._y;
    }

    /**
     * Sets the y-coordinate of this sprite's position.
     * @param {number} y the y-coordinate
     */
    set y(y) {
        this._y = y;
    }

    /**
     * Returns the number of rotations per minute that this sprite is rotating.
     * @returns {number} the rotation of this sprite, in rotations per minute
     */
    get rpm() {
        return this._rpm;
    }

    /**
     * Sets the number of rotations per minute that this sprite is rotating.
     * @param {number} rpm the rotation of this sprite, in rotations per minute
     */
    set rpm(rpm) {
        this._rpm = rpm;
    }

    /**
     * Returns the x-coordinate of the position of this sprite, scaled to the game canvas
     * @returns {number} the scaled x-coordinate
     */
    get scaledX() {
        return this.game.getScaledWidth(this.x);
    }

    /**
     * Returns the y-coordinate of the position of this sprite, scaled to the game canvas
     * @returns {number} the scaled y-coordinate
     */
    get scaledY() {
        return this.game.getScaledHeight(this.y);
    }

    /**
     * Returns the hit region of this sprite.
     * @return {SAT.Circle|SAT.Vector} the hit region, or <code>null</code> if this sprite has no hit region
     */
    get hitRegion() {
        return this._hitRegion;
    }

    /**
     * Sets the hit region of this sprite.
     * @param {SAT.Circle|SAT.Vector} region the hit region
     */
    set hitRegion(region) {
        this._hitRegion = region;
    }

    /**
     * Updates the state of this sprite.
     * @param {number} dt the time delta
     */
    update(dt) {
        this.rotation += this.rpm * dt * ROTATION_PER_MILLISECOND;
        if (this.rotation > FULL_CIRCLE) {
            this.rotation -= FULL_CIRCLE;
        } else if (this.rotation < 0) {
            this.rotation += FULL_CIRCLE;
        }
        this.x += this.dx * SPRITE_VELOCITY_FACTOR * dt;
        this.y += this.dy * SPRITE_VELOCITY_FACTOR * dt;
        if (this.x < 0) {
            this.x += REFERENCE_WIDTH;
        } else if (this.x > REFERENCE_WIDTH) {
            this.x -= REFERENCE_WIDTH;
        }
        if (this.y < 0) {
            this.y += REFERENCE_HEIGHT;
        } else if (this.y > REFERENCE_HEIGHT) {
            this.y -= REFERENCE_HEIGHT;
        }
    }

    /**
     * Draws this sprite on the game canvas.
     */
    draw() {
        const ctx = this.game.gameContext;
        ctx.save();
        ctx.translate(this.scaledX, this.scaledY);
        ctx.save();
        ctx.rotate(this.rotation);
        this.drawInternal(ctx);
        ctx.restore();

        let wraparound = false;
        if (this.x - this.radius < 0) {
            ctx.translate(this.game.getScaledWidth(REFERENCE_WIDTH), 0);
            wraparound = true;
        } else if (this.x + this.radius > REFERENCE_WIDTH) {
            ctx.translate(this.game.getScaledWidth(-REFERENCE_WIDTH), 0);
            wraparound = true;
        }
        if (this.y - this.radius < 0) {
            ctx.translate(0, this.game.getScaledHeight(REFERENCE_HEIGHT));
            wraparound = true;
        } else if (this.y + this.radius > REFERENCE_HEIGHT) {
            ctx.translate(0, this.game.getScaledHeight(-REFERENCE_HEIGHT));
            wraparound = true;
        }
        if (wraparound) {
            ctx.rotate(this.rotation);
            this.drawInternal(ctx);
        }
        ctx.restore();
    }

    /**
     * Draws this sprite.
     * @param {CanvasRenderingContext2D} ctx the context to draw to
     */
    drawInternal(ctx) {
        this.drawSprite(ctx);
        if (this.game.drawDebug) {
            ctx.save();
            ctx.strokeStyle = this.game.drawDebugStyle;
            ctx.beginPath();
            ctx.arc(0, 0, Math.floor(this.game.getScaledHeight(this.radius)), 0, FULL_CIRCLE);
            ctx.stroke();
            ctx.restore();
        }
    }

    /**
     * Draws the sprite.  The rendering context will have been translated and rotated before this method is called.
     * @abstract
     * @param {CanvasRenderingContext2D} ctx the rendering context
     */
    drawSprite(ctx) {
        throw new Error('must be implemented by subclass!');
    }

    /**
     * Checks for a collision between this sprite and another sprite.
     * @param {Sprite} sprite the sprite to check
     */
    checkForCollision(sprite) {
        if (this.canCollideWith(sprite) && this.isColliding(sprite)) {
            this.collisionDetected(sprite);
            sprite.collisionDetected(this);
        }
    }

    /**
     * Notifies this sprite that a collision has been detected between it and another sprite.
     * @param {Sprite} sprite the sprite that collided with this sprite
     */
    collisionDetected(sprite) {
    }

    /**
     * Checks if this sprite can collide with another sprite.
     * @param {Sprite} sprite the sprite
     * @return {boolean} <code>true</code> if this sprite can collide with the specified sprite, <code>false</code>
     * otherwise
     */
    canCollideWith(sprite) {
        return false;
    }

    /**
     * Checks if this sprite is colliding with another sprite.
     * @param {Sprite} sprite the sprite to check
     * @return {boolean} <code>true</code> if this sprite is colliding with the specified sprite, <code>false</code>
     * otherwise
     */
    isColliding(sprite) {
        return this.isHitRegionOverlapping(sprite) && this.isSpriteOverlapping(sprite);
    }

    /**
     * Checks if this sprite's hit region overlaps with that of a specified sprite.
     * @param  {Sprite} sprite the sprite to check
     * @return {boolean} <code>true</code> if this sprite's hit region overlaps with that of the specified sprite,
     * <code>false</code> otherwise
     */
    isHitRegionOverlapping(sprite) {
        function unhandledHitRegion(hitRegion) {
            throw new Error("unhandled hit region type " + hitRegion.constructor.name);
        }

        const myHitRegion = this.hitRegion;
        if (myHitRegion == null) {
            return false;
        }
        const spriteHitRegion = sprite.hitRegion;
        if (spriteHitRegion == null) {
            return false;
        }
        if (myHitRegion instanceof SAT.Circle) {
            if (spriteHitRegion instanceof SAT.Circle) {
                return SAT.testCircleCircle(myHitRegion, spriteHitRegion);
            } else if (spriteHitRegion instanceof SAT.Vector) {
                return SAT.pointInCircle(spriteHitRegion, myHitRegion);
            } else {
                unhandledHitRegion(spriteHitRegion);
            }
        } else if (myHitRegion instanceof SAT.Vector) {
            if (spriteHitRegion instanceof SAT.Circle) {
                return SAT.pointInCircle(myHitRegion, spriteHitRegion);
            } else if (spriteHitRegion instanceof SAT.Vector) {
                return myHitRegion.x == spriteHitRegion.x && myHitRegion.y == spriteHitRegion.y;
            } else {
                unhandledHitRegion(spriteHitRegion);
            }
        } else {
            unhandledHitRegion(myHitRegion);
        }
    }

    /**
     * Checks if this sprite's actual boundaries overlap with those of a specified sprite.
     * @param {Sprite} sprite the sprite to check
     * @return {boolean} <code>true</code> if this sprite's boundaries overlap with those of the specified sprite,
     * <code>false</code> otherwise
     */
    isSpriteOverlapping(sprite) {
        // check actual boundaries via SAT
        //    SAT polygon(s) should be created once, and then we set angle and offset on it when we're checking. but we
        //    should only set angle and offset once per update, so keep a flag to optimize this (clear flag in update(),
        //    set flag when applying the angle and offset)
        // TODO implement me
        return true;
    }
}

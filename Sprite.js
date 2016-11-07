"use strict";

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
        this.boundingRegionsUpdated = false;
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
     * Returns the z-index (stack order) of this sprite.
     * A sprite with a higher stack order is always in front of a sprite with a lower stack order.
     * @return {number} the z-index
     */
    get z() {
        return 0;
    }

    /**
     * Returns the direction that this sprite is traveling.
     * @returns {number} the direction, in radians
     */
    get direction() {
        return Math.atan2(this.dy, this.dx);
    }

    /**
     * Returns the speed of this sprite.
     * @return {number} the speed
     */
    get speed() {
        return Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
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
     * Returns the radius of the bounding circle of this sprite.
     * @return {number} the radius
     */
    get radius() {
        return 0;
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
        if (this.timeRemaining != null) {
            this.timeRemaining -= dt;
            if (this.timeRemaining <= 0) {
                this.expired();
                return;
            }
        }
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
        this.boundingRegionsUpdated = false;
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
     * Called to indicate that this sprite has expired (i.e. its time remaining has elapsed)
     */
    expired() {
        this.game.removeSprite(this);
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
        return Sprite.testOverlap(this.hitRegion, sprite.hitRegion);
    }

    /**
     * Checks if this sprite's actual boundaries overlap with those of a specified sprite.
     * @param {Sprite} sprite the sprite to check
     * @return {boolean} <code>true</code> if this sprite's boundaries overlap with those of the specified sprite,
     * <code>false</code> otherwise
     */
    isSpriteOverlapping(sprite) {
        return this.updatedBoundingRegions.some(myBoundingRegion => {
            return sprite.updatedBoundingRegions.some(spriteBoundingRegion => {
                    return Sprite.testOverlap(myBoundingRegion, spriteBoundingRegion);
                }
            );
        });
    }

    /**
     * Returns the bounding regions of this sprite, updating them if needed.
     * @return {[SAT.Circle|SAT.Polygon|SAT.Vector]} the updated bounding regions
     */
    get updatedBoundingRegions() {
        if (!this.boundingRegionsUpdated) {
            this.updateBoundingRegions();
        }
        return this.boundingRegions;
    }

    /**
     * Updates this sprite's bounding regions.
     */
    updateBoundingRegions() {
        if (this.boundingRegions != null) {
            this.boundingRegions.forEach(boundingRegion => {
                if (boundingRegion instanceof SAT.Circle) {
                    boundingRegion.pos.x = this.x;
                    boundingRegion.pos.y = this.y;
                } else if (boundingRegion instanceof SAT.Polygon) {
                    boundingRegion.pos.x = this.x;
                    boundingRegion.pos.y = this.y;
                    boundingRegion.setAngle(this.rotation);
                } else if (boundingRegion instanceof SAT.Vector) {
                    boundingRegion.x = this.x;
                    boundingRegion.y = this.y;
                } else {
                    Sprite.unhandledRegionType(boundingRegion);
                }
            });
        }
        this.boundingRegionsUpdated = true;
    }

    /**
     * Tests for overlap between two regions.
     * @param {SAT.Circle|SAT.Polygon|SAT.Vector} region1 the first region
     * @param {SAT.Circle|SAT.Polygon|SAT.Vector} region2 the second region
     * @return {boolean} <code>true</code> if the two regions overlap, <code>false</code> otherwise
     */
    static testOverlap(region1, region2) {
        if (region1 instanceof SAT.Circle) {
            if (region2 instanceof SAT.Circle) {
                return SAT.testCircleCircle(region1, region2);
            } else if (region2 instanceof SAT.Polygon) {
                return SAT.testCirclePolygon(region1, region2);
            } else if (region2 instanceof SAT.Vector) {
                return SAT.pointInCircle(region2, region1);
            } else {
                Sprite.unhandledRegionType(region2);
            }
        } else if (region1 instanceof SAT.Polygon) {
            if (region2 instanceof SAT.Circle) {
                return SAT.testPolygonCircle(region1, region2);
            } else if (region2 instanceof SAT.Polygon) {
                return SAT.testPolygonPolygon(region1, region2);
            } else if (region2 instanceof SAT.Vector) {
                return SAT.pointInPolygon(region2, region1);
            } else {
                Sprite.unhandledRegionType(region2);
            }
        } else if (region1 instanceof SAT.Vector) {
            if (region2 instanceof SAT.Circle) {
                return SAT.pointInCircle(region1, region2);
            } else if (region2 instanceof SAT.Polygon) {
                return SAT.pointInPolygon(region1, region2);
            } else if (region2 instanceof SAT.Vector) {
                return region1.x == region2.x && region1.y == region2.y;
            } else {
                Sprite.unhandledRegionType(region2);
            }
        } else {
            Sprite.unhandledRegionType(region1);
        }
    }

    /**
     * Called when an unknown type of region is encountered.
     * @param {Object} region the region
     */
    static unhandledRegionType(region) {
        throw new Error(`unhandled region type ${region.constructor.name}`);
    }
}

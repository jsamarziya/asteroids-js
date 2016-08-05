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
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.rotation = 0;
        this._rpm = 0;
        this.radius = 0;
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
     * Returns the x-coordinate of the location of this sprite, scaled to the game canvas
     * @returns {number} the scaled x-coordinate
     */
    get scaledX() {
        return this.game.getScaledWidth(this.x);
    }

    /**
     * Returns the y-coordinate of the location of this sprite, scaled to the game canvas
     * @returns {number} the scaled y-coordinate
     */
    get scaledY() {
        return this.game.getScaledHeight(this.y);
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
     * @param ctx the context to draw to
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
     * Checks whether or not this sprite can collide with another sprite.
     * @param {Sprite} sprite the sprite
     * @return {boolean} true if this sprite can collide with the specified sprite, false otherwise
     */
    canCollideWith(sprite) {
        return false;
    }
}

const FULL_CIRCLE = 2 * Math.PI;
const SPRITE_VELOCITY_FACTOR = 1 / 1000;

class Sprite {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.rotation = 0;
    }

    update(dt) {
        if (this.rotation > FULL_CIRCLE) {
            this.rotation -= FULL_CIRCLE;
        } else if (this.rotation < 0) {
            this.rotation += FULL_CIRCLE;
        }
        this.x += this.dx * SPRITE_VELOCITY_FACTOR * dt;
        this.y += this.dy * SPRITE_VELOCITY_FACTOR * dt;
    }

    draw(ctx, scale) {
        ctx.save();
        ctx.translate(Math.floor(this.x * scale), Math.floor(this.y * scale));
        ctx.rotate(this.rotation);
        this.drawSprite(ctx, scale);
        ctx.restore();
    }
}
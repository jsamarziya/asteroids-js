"use strict";

const ASTEROID_RADII = 11;
const ASTEROID_SEGMENT_ROTATION = FULL_CIRCLE / ASTEROID_RADII / 2;

class Asteroid extends Sprite {
    constructor(size) {
        super();
        this.radii = Asteroid.createRadii(size);
    }

    static createRadii(size) {
        let radii = [];
        for (let i = 0; i < ASTEROID_RADII; i++) {
            const radius = (1 - Math.random() * .5) * size;
            radii.push(radius);
        }
        return radii;
    }

    get rpm() {
        return 1;
    }

    drawSprite(ctx, scale) {
        ctx.beginPath();
        this.radii.forEach(radius => {
                for (let i = 0; i < 2; i++) {
                    ctx.rotate(ASTEROID_SEGMENT_ROTATION);
                    ctx.lineTo(0, Math.floor(radius * scale));
                }
            }
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        if (asteroids.drawDebug) {
            ctx.save();
            ctx.strokeStyle = DEBUG_STYLE;
            ctx.beginPath();
            this.radii.forEach(radius => {
                    for (let i = 0; i < 2; i++) {
                        ctx.rotate(ASTEROID_SEGMENT_ROTATION);
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, Math.floor(radius * scale));
                    }
                }
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 100, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
        }
    }
}


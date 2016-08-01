"use strict";

const ASTEROID_RADII = 11;
const ASTEROID_SEGMENT_ROTATION = FULL_CIRCLE / ASTEROID_RADII / 2;

class Asteroid extends Sprite {
    constructor(game, size) {
        super(game);
        this.size = size;
        this.radii = this.createRadii();
    }

    createRadii() {
        const radii = [];
        for (let i = 0; i < ASTEROID_RADII; i++) {
            const radius = (1 - Math.random() * 0.5) * this.size;
            radii.push(radius);
        }
        return radii;
    }

    drawSprite() {
        const ctx = this.game.gameContext;
        const scale = this.game.scale;
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
        if (this.game.drawDebug) {
            ctx.save();
            ctx.strokeStyle = this.game.drawDebugStyle;
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
            ctx.arc(0, 0, Math.floor(this.size * scale), 0, FULL_CIRCLE);
            ctx.stroke();
            ctx.restore();
        }
    }
}

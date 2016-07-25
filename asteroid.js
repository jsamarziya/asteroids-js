"use strict";

class Asteroid extends Sprite {
    constructor(size) {
        super();
        this.path = Asteroid.createPath(size);
    }

    static createPath(size) {
        let points = [];
        let rotation = 0;
        while (true) {
            let angle = Math.random() * .3 + .2;
            rotation += angle;
            if (rotation > FULL_CIRCLE) {
                break;
            }
            let radius = (1.5 - Math.random() * .5) * size;
            points.push({angle: angle, radius: radius});
        }
        return points;
    }

    get rotationDelta() {
        return 0.00015;
    }

    drawSprite(ctx, scale) {
        ctx.beginPath();
        this.path.forEach(point => {
            ctx.rotate(point.angle);
            ctx.lineTo(0, Math.floor(point.radius * scale));
        });
        ctx.closePath();
        ctx.stroke();
    }
}


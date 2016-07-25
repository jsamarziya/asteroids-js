"use strict";

class Asteroid extends Sprite {
    constructor(size) {
        super();
        this.path = Asteroid.createPath(size);
    }

    static createPath(size) {
        let points = [];
        let rotation = 0;
        let radius = size;
        let setRadius = true;
        while (true) {
            let angle = Math.random() * .2 + .2;
            rotation += angle;
            if (setRadius) {
                radius = (1 - Math.random() * .4) * size;
            }
            setRadius = !setRadius;
            points.push({angle: angle, radius: radius});
            if (rotation > FULL_CIRCLE) {
                points.push({angle: 0, radius: radius});
                break;
            }
        }
        return points;
    }

    get rpm() {
        return 1;
    }

    drawSprite(ctx, scale) {
        ctx.beginPath();
        this.path.forEach(point => {
            ctx.rotate(point.angle);
            ctx.lineTo(0, Math.floor(point.radius * scale));
            // ctx.lineTo(0, 0);
            // ctx.lineTo(0, Math.floor(point.radius * scale));
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // ctx.beginPath();
        // ctx.arc(0, 0, 100, 0, 2 * Math.PI);
        // ctx.stroke();
    }
}


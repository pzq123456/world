import { Polygon } from "./polygon.js";
import { add, scale, substract } from "./utils.js";

export class Building{
    constructor (poly, heightCoef = 0.4){
        this.base = poly;
        this.heightCoef = heightCoef;
    }

    draw(ctx, viewPoint){

        const topPoints = 
            this.base.points.map(
                (p)=>add(p, scale(substract(p, viewPoint), this.heightCoef))
            );
        const ceiling = new Polygon(topPoints);

        const sides = [];
        for (let i = 0; i < this.base.points.length; i++) {
            const nextI = (i + 1) % this.base.points.length;
            const poly = new Polygon ([
                this.base.points[i], this.base.points[nextI],
                topPoints[nextI], topPoints[i],
            ]);
            sides.push(poly);
        }

        this.base.draw(ctx, {fillStyle: "rgb(200, 200, 200)"});
        for (const side of sides) {
            side.draw(ctx, {fillStyle: "rgb(150, 150, 150)", strokeStyle : "#AAA"});
        }
        ceiling.draw(ctx, { fillStyle: "white", strokeStyle: "#AAA" });
    }
}
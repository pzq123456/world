import { Segment } from "./segment.js";
import { add, substract, scale, lerp2D, lerp } from "./utils.js";

export class Tree{
    constructor(center, size, heightCoef = 0.3){
        this.center = center;
        this.size = size; // size of the tree
        this.heightCoef = heightCoef;
    }

    draw(ctx, viewPoint){
        const diff = substract(this.center, viewPoint, this.heightCoef);
        const top = add(this.center, scale(diff, this.heightCoef));

        const levelcount = 7;
        for (let level = 0; level < levelcount; level++) {
            const t = level / (levelcount - 1) ;
            const point = lerp2D(this.center, top, t);
            const color = "rgb(30," + lerp(50, 200, t) + ",70)";
            const size = lerp(this.size, 20, t);

            point. draw(ctx, { size, color });
        }

        // new Segment(this.center, top).draw(ctx);
    }
}
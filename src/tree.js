import { Segment } from "./segment.js";
import { add } from "./utils.js";

export class Tree{
    constructor(center,size){
        this.center = center;
        this.size = size; // size of the tree
    }

    draw(ctx){
        this.center.draw(ctx, { size : this.size, color: 'green' });

        const top = add(this.center, {x: -10, y: -10});
        new Segment(this.center, top).draw(ctx);
    }
}
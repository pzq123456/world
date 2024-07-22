import { translate, angle, substract } from "./utils.js";
import { Polygon } from "./polygon.js";
export class Envelope{
    constructor(skeleton, width, roundness = 0){
        this.skeleton = skeleton;
        this.poly = this.#generatePolygon(width, roundness);
    }

    #generatePolygon(width, roundness){
        const { p1,p2 } = this.skeleton;
        const redius = width / 2;

        const alpha = angle(substract(p1, p2));
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;

        const Points = [];
        const step = Math.PI / Math.max(1, roundness);
        const esp = step / 2;
        for(let i = alpha_ccw; i <= alpha_cw + esp; i += step){
            Points.push(translate(p1, i, redius));
        }
        for(let i = alpha_ccw; i <= alpha_cw + esp; i += step){
            Points.push(translate(p2, i + Math.PI, redius));
        }

        return new Polygon(Points);
    }

    draw(ctx, {fillStyle = 'rgba(0, 0, 0, 0.1)', strokeStyle = 'black', lineWidth = 1} = {}){
        this.poly.draw(ctx, {fillStyle, strokeStyle, lineWidth});
    }
}
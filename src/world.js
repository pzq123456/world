import { Envelope } from "./envelope.js";
import { Polygon } from "./polygon.js";
import { Segment } from "./segment.js";
import { add, scale, lerp, distance } from "./utils.js";
import { Point } from "./point.js";

export class World{
    constructor(
        graph,
        roadWidth = 100,
        roadRoundness = 5,
        buildingWidth = 150,
        buildingMinWidth = 150,
        spacing = 50,
        treeSize = 50
    ){
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinWidth = buildingMinWidth;
        this.spacing = spacing;
        this.treeSize = treeSize


        this.buildings = [];
        this.trees = [];
        this.envelopes = [];
        this.roadBorders = [];
        this.generate();
    }

    generate(){
        this.envelopes = this.graph.segments.map(edge => new Envelope(edge, this.roadWidth, this.roadRoundness));

        this.roadBorders = Polygon.union(this.envelopes.map(env => env.poly));
        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();
    }

    #generateTrees(){
        const points = [
            ...this.roadBorders.map((seg) => [seg.p1, seg.p2]).flat(),
            ...this.buildings.map((b) => b.points).flat()
        ]

        const left = Math.min(...points.map(p => p.x));
        const right = Math.max(...points.map(p => p.x));
        const top = Math.max(...points.map(p => p.y));
        const bottom = Math.min(...points.map(p => p.y));

        const illegalPolys = [
            ...this.buildings,
            ...this.envelopes.map(env => env.poly)
        ]

        const trees = [];
        let tryCount = 0;
        while(tryCount < 100){
            const p = new Point(
                lerp(left,right, Math.random()),
                lerp(bottom, top, Math.random())
            );

            // check if tree inside or nearby buildings / roads
            let keep = true;
            for(const poly of illegalPolys){ // can not be inside buildings or roads
                if(poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize){
                    keep = false;
                    break;
                }
            }

            if(keep){ // can not overlap with other trees
                for(const tree of trees){
                    if(distance(tree,p) < this.treeSize){
                        keep = false;
                        break;
                    }
                }
            }

            // avoidingt trees in the middle of nowhere
            if(keep){
                let closeToSomething = false;
                for(const poly of illegalPolys){
                    if(poly.distanceToPoint(p) < this.treeSize * 2){
                        closeToSomething = true;
                        break;
                    }
                }
                keep = closeToSomething;
            }

            if(keep){
                trees.push(p);
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }

    #generateBuildings(){
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            const env = new Envelope(
                seg, 
                this.roadWidth + this.buildingWidth + this.spacing * 2, 
                this.roadRoundness);
            tmpEnvelopes.push(env);
        }
        
        const guides = Polygon.union(tmpEnvelopes.map(env => env.poly));

        // remove guides too short
        for(let i = 0; i < guides.length; i++){
            const seg = guides[i];
            if(seg.length() < this.buildingMinWidth){
                guides.splice(i, 1);
                i--;
            }
        }

        const supports = [];
        for (let seg of guides) {
            const len = seg.length() + this.spacing;
            const buildingcount = Math.floor(
                len / (this.buildingMinWidth + this.spacing)
            );
            const buildingLength = len / buildingcount - this.spacing;

            const dir = seg.directionVector();

            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));

            for(let i = 2; i <= buildingcount; i++){
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));
                supports.push(new Segment(q1, q2));
            }
        }

        let bases = [];

        for(const seg of supports){
            const env = new Envelope(seg, this.buildingWidth);
            bases.push(env.poly);
        }

        // remove intersecting polys
        for(let i = 0; i < bases.length - 1; i++){
            for(let j = i + 1; j < bases.length; j++){
                if(
                    bases[i].intersectsPoly(bases[j]) ||
                    bases[i].distanceToPoly(bases[j]) < this.spacing
                ){
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases;
    }

    draw(ctx){
        for (const env of this.envelopes) {
            env.draw(ctx, { fillStyle: "#BBB", strokeStyle: "#BBB", lineWidth: 15 });
        }
        for (const seg of this.graph.segments) {
            seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
        }
        for (const seg of this.roadBorders) {
            seg.draw(ctx, { color: "white", width: 4 });
        }

        for(const tree of this.trees){
            tree.draw(ctx, { size: this.treeSize, color: "green"})
        }
        for (const building of this.buildings) {
            building.draw(ctx, { fillStyle: "#333", strokeStyle: "#333" });
        }
    }
}
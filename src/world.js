import { Envelope } from "./envelope.js";
import { Polygon } from "./polygon.js";

export class World{
    constructor(graph, roadWidth = 100, roadRoundness = 5){
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;

        this.envelopes = [];
        this.roadBorders = [];
        this.generate();
    }

    generate(){
        this.envelopes = this.graph.segments.map(edge => new Envelope(edge, this.roadWidth, this.roadRoundness));

        this.roadBorders = Polygon.union(this.envelopes.map(env => env.poly));
    }

    draw(ctx){
        // this.envelopes.forEach(env => env.draw(ctx));

        this.roadBorders.forEach(seg => seg.draw(ctx));
    }
}
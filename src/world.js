import { Envelope } from "./envelope.js";
import { Polygon } from "./polygon.js";

export class World{
    constructor(
        graph,
        roadWidth = 100,
        roadRoundness = 5,
        buildingWidth = 100,
    ){
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
        for (const env of this.envelopes) {
            env.draw(ctx, { fillStyle: "#BBB", strokeStyle: "#BBB", lineWidth: 15 });
        }
        for (const seg of this.graph.segments) {
            seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
        }
        for (const seg of this.roadBorders) {
            seg.draw(ctx, { color: "white", width: 4 });
        }
    }
}
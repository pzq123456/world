import { Graph, Editor, Viewport, Polygon, Envelope, utils, World } from "./src/index.js";

const myCanvas = document.getElementById('myCanvas');
myCanvas.height = 900;
myCanvas.width = 900;

const graphString = localStorage.getItem("graph");
const graphInfo = graphString ? JSON.parse(graphString) : null;
const graph = graphInfo
            ? Graph.load(graphInfo)
            : new Graph();
const world = new World(graph);

const viewport = new Viewport(myCanvas);
const editor = new Editor(viewport, graph);

let oldGraphHash = graph.hash();
animate();

function animate(){
    viewport.reset();
    if(oldGraphHash != graph.hash()){
        world.generate();
        oldGraphHash = graph.hash();
    }
    // world.generate();
    world.draw(viewport.ctx);
    editor.display();
    requestAnimationFrame(animate);
}

utils.bindFunctionToElement(save);
utils.bindFunctionToElement(dispose);

function save() {
    localStorage.setItem("graph", JSON.stringify(graph));
}

function dispose() {
    editor.dispose();
}
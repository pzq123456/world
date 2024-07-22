import { Graph, Editor, Viewport, Polygon, Envelope, utils, World } from "./src/index.js";

const myCanvas = document.getElementById('myCanvas');
myCanvas.height = 600;
myCanvas.width = 600;

const graphString = localStorage.getItem("graph");
const graphInfo = graphString ? JSON.parse(graphString) : null;
const graph = graphInfo
            ? Graph.load(graphInfo)
            : new Graph();
const world = new World(graph);

const viewport = new Viewport(myCanvas);
const editor = new Editor(viewport, graph);

animate();

function animate(){
    viewport.reset();
    world.generate();
    world.draw(viewport.ctx);
    editor.display();
    new Polygon(graph.points).draw(viewport.ctx, {fillStyle: 'rgba(0, 0, 0, 0.1)'});
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
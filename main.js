import { Graph, Editor, Viewport, utils } from "./src/index.js";

const myCanvas = document.getElementById('myCanvas');
myCanvas.height = 600;
myCanvas.width = 600;

const graphString = localStorage.getItem("graph");
const graphInfo = graphString ? JSON.parse(graphString) : null;
const graph = graphInfo
            ? Graph.load(graphInfo)
            : new Graph();
const viewport = new Viewport(myCanvas);
const editor = new Editor(viewport, graph);

animate();

function animate(){
    viewport.reset();
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
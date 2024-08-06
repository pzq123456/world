import { Segment } from "./segment.js";
import { getNearestPoint } from "./utils.js";

export class Editor{
   constructor(viewport, graph) {
      this.viewport = viewport;
      this.canvas = viewport.canvas;
      this.graph = graph;

      this.ctx = this.canvas.getContext("2d");

      this.selected = null;
      this.hovered = null;
      this.dragging = false;
      this.mouse = null;

      this.#addEventListeners();
   }

   #addEventListeners() {
      this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
      this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
      this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
      this.canvas.addEventListener("mouseup", () => this.dragging = false);
   }

   #handleMouseMove(evt) {
      this.mouse = this.viewport.getMouse(evt, true);
      this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
      if (this.dragging == true) {
         this.selected.x = this.mouse.x;
         this.selected.y = this.mouse.y;
      }
   }

   #handleMouseDown(evt) {
      if (evt.button == 2) { // right click
         if (this.selected) {
            this.selected = null;
         } else if (this.hovered) {
            this.#removePoint(this.hovered);
         }
      }
      if (evt.button == 0 && !evt.ctrlKey) { // left click
         if (this.hovered) {
            this.#select(this.hovered);
            this.dragging = true;
            return;
         }
         this.graph.addPoint(this.mouse);
         this.#select(this.mouse);
         this.hovered = this.mouse;
      }
   }

   #select(point) {
      if (this.selected) {
         this.graph.tryAddSegment(new Segment(this.selected, point));
      }
      this.selected = point;
   }

   #removePoint(point) {
      this.graph.removePoint(point);
      this.hovered = null;
      if (this.selected == point) {
         this.selected = null;
      }
   }

   dispose() {
      this.graph.dispose();
      this.selected = null;
      this.hovered = null;
   }

   display(){

      this.graph.draw(this.ctx);
      if (this.selected){
         let intent = this.hovered ? this.hovered : this.mouse;
         new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3] });
         this.mouse.draw(this.ctx,{size: 15, color: "blue"});
         this.selected.draw(this.ctx,{size: 18, outline: "yellow"});
      }
      if (this.hovered){
         this.hovered.draw(this.ctx,{size: 10, color: "yellow"});
      }
      // draw this.mouse
      if(this.mouse){
         this.mouse.draw(this.ctx,{size: 5, color: "red"});
         // text the mouse position
         this.ctx.font = "15px Arial";
         this.ctx.fillStyle = "black";
         this.ctx.fillText(`(${this.mouse.x}, ${this.mouse.y})`, this.mouse.x + 10, this.mouse.y - 10);
      }

   }
}
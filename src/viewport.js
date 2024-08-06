import { Point } from "./point.js";
import { substract, add, scale } from "./utils.js";
export class Viewport{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.zoom = 1;
        this.center = new Point(canvas.width / 2, canvas.height / 2);
        this.offset = scale(this.center, -1);

        this.drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false,
        }

        this.#addEventListeners();
    }
    
    reset() {
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.center.x, this.center.y);
        this.ctx.scale(1 / this.zoom, 1 / this.zoom);
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y);

        // 绘制原点
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        this.ctx.fill();
        
    }
  

    getMouse(evt,substractDragOffset = false){
        const p = new Point(
            (evt.offsetX - this.center.x) * this.zoom - this.offset.x ,
            (evt.offsetY - this.center.y) * this.zoom - this.offset.y 
        );
        return substractDragOffset ? substract(p, this.drag.offset) : p;
    }

    getOffset(){
        return add(this.offset, this.drag.offset);
    }

    #addEventListeners(){
        this.canvas.addEventListener('wheel', this.#handleMouseWheel.bind(this));
        this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.#handleMouseUp.bind(this));
    }

    #handleMouseWheel(e){
        const dir = Math.sign(e.deltaY);
        const step = 0.1;
        this.zoom += step * dir;
        this.zoom = Math.max(0.1, Math.min(5, this.zoom));
    }

    #handleMouseDown(e){
        // 若设备没有鼠标中键 MacOS command
        if(e.button === 0 && e.ctrlKey){
            this.drag.active = true;
            this.drag.start = this.getMouse(e);
        }

        if(e.button === 1){
            this.drag.active = true;
            this.drag.start = this.getMouse(e);
        }

    }

    #handleMouseMove(e){
        if(this.drag.active){
            this.drag.end = this.getMouse(e);
            this.drag.offset = substract(this.drag.end, this.drag.start);
        }
    }

    #handleMouseUp(e){
        if(this.drag.active){
            this.offset = add(this.offset, this.drag.offset);
            this.drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false,
            }
        }
        
    }

}
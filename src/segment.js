import { distance, magnitude, normalize, substract, scale, dot, add } from "./utils.js";
export class Segment {
      constructor(p1, p2) {
         this.p1 = p1;
         this.p2 = p2;
      }

      length() {
         return distance(this.p1, this.p2);
      }

      directionVector(){ 
         return normalize(substract(this.p2, this.p1));
      }

      equals(seg) {
         return this.includes(seg.p1) && this.includes(seg.p2);
      }

      includes(point) {
         return this.p1.equals(point) || this.p2.equals(point);
      }

      distanceToPoint(point) {
         const proj = this.projectPoint(point);
         if(proj.offset > 0 && proj.offset < 1){
            return distance(proj.point, point);
         }

         const d1 = distance(this.p1, point);
         const d2 = distance(this.p2, point);
         return Math.min(d1, d2);
      }
      
      projectPoint(point){
         const a = substract(point, this.p1);
         const b = substract(this.p2, this.p1);
         const normB = normalize(b);
         const scaler = dot(a, normB);
         const proj = {
            point: add(this.p1, scale(normB, scaler)),
            offset: scaler / magnitude(b)
         };
         return proj;
      }

      draw(ctx, {width = 2, color = "white", dash = []} = {}) {
         ctx.beginPath();
         ctx.strokeStyle = color;
         ctx.lineWidth = width;
         ctx.setLineDash(dash);
         ctx.moveTo(this.p1.x, this.p1.y);
         ctx.lineTo(this.p2.x, this.p2.y);
         ctx.stroke();
         ctx.setLineDash([]);
      }
 }
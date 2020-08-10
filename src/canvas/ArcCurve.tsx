import { Curve } from "./Curve";
import { Point } from "./Point";
import { Vector } from "./Vector";

export class ArcCurve extends Curve {
    radius: number;
    center: Point;
    startAngle: number;
    endAngle: number;

    constructor(start: Point, end: Point, control: Point) {
        super(start, end, control);
        this.center = this.computeCenter();
        this.radius = this.computeRadius();
        // TODO: use vectors here
        this.startAngle = Math.atan2((this.start.y - this.center.y), (this.start.x - this.center.x));
        this.endAngle = Math.atan2((this.end.y - this.center.y), (this.end.x - this.center.x));
        //make sure we go in the right direction on the circle
        if (Math.abs(this.endAngle - this.startAngle) > Math.PI) {
            if (this.startAngle < this.endAngle) {
                this.startAngle += 2 * Math.PI;
            } else {
                this.endAngle += 2 * Math.PI;
            }
        }
    }

    computeCenter = (): Point => {
        // TODO: check for divisions by 0
        // TODO: use Vector class here
        const normalVector = [this.start.y - this.end.y, this.end.x - this.start.x];
        const middle = Point.computeMiddlePoint(this.start, this.end);
        const x = (this.start.x * (this.control.x - this.start.x) + (middle.x * normalVector[1] / normalVector[0] - middle.y + this.start.y) * (this.control.y - this.start.y)) / (normalVector[1] * (this.control.y - this.start.y) / normalVector[0] + (this.control.x - this.start.x));
        const y = (x - middle.x) * normalVector[1] / normalVector[0] + middle.y;
        return new Point(x, y);
    }

    computeRadius = (): number => {
        return Math.sqrt(this.start.distanceSquared(this.center));
    }

    computePoint = (t: number): Point => {     
        const x = this.center.x + 
                  this.radius * Math.cos(this.lerp(this.startAngle, this.endAngle, t));
        const y = this.center.y + 
                  this.radius * Math.sin(this.lerp(this.startAngle, this.endAngle, t));
        return new Point(x, y);
    };

    drawCurve = (path: Path2D): void => {
        path.arcTo(this.control.x, this.control.y, 
                   this.end.x, this.end.y, 
                   this.radius);
    }

    // override the approximation algorithm from parent class
    getLength = (): number => {
        const u = Vector.vectorBetweenPoints(this.control, this.start);
        const v = Vector.vectorBetweenPoints(this.control, this.end);
        const alpha = Vector.angleBetween(u, v);
        // theta is the central angle between starting point and end point
        const theta = Math.PI - alpha;
        return theta * this.radius;
    }
}
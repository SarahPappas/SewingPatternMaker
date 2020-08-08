import { Curve } from "./Curve";
import { Point } from "./Point";

export class ArcCurve extends Curve {
    radius: number;
    center: Point;
    startAngle: number;
    endAngle: number;

    constructor(start: Point, end: Point, control: Point) {
        super(start, end, control);
        this.center = this.computeCenter();
        this.radius = this.computeRadius();
        this.startAngle = Math.atan2((this.start.getY() - this.center.getY()), (this.start.getX() - this.center.getX()));
        this.endAngle = Math.atan2((this.end.getY() - this.center.getY()), (this.end.getX() - this.center.getX()));
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
        const normalVector = [this.start.getY() - this.end.getY(), this.end.getX() - this.start.getX()];
        const middle = this.start.computeMiddlePoint(this.end);
        const x = (this.start.getX() * (this.control.getX() - this.start.getX()) + (middle.getX() * normalVector[1] / normalVector[0] - middle.getY() + this.start.getY()) * (this.control.getY() - this.start.getY())) / (normalVector[1] * (this.control.getY() - this.start.getY()) / normalVector[0] + (this.control.getX() - this.start.getX()));
        const y = (x - middle.getX()) * normalVector[1] / normalVector[0] + middle.getY();
        return new Point(x, y);
    }

    computeRadius = (): number => {
        return Math.sqrt(this.start.distanceSquared(this.center));
    }

    computePoint = (t: number): Point => {     
        const x = this.center.getX() + 
                  this.radius * Math.cos(this.lerp(this.startAngle, this.endAngle, t));
        const y = this.center.getY() + 
                  this.radius * Math.sin(this.lerp(this.startAngle, this.endAngle, t));
        return new Point(x, y);
    };

    drawCurve = (path: Path2D): void => {
        path.arcTo(this.control.getX(), this.control.getY(), 
                   this.end.getX(), this.end.getY(), 
                   this.radius);
    }

    // override the approximation algorithm from parent class
    getLength = (): number => {
        const u = [this.start.getX() - this.control.getX(), this.start.getY() - this.control.getY()];
        const v = [this.end.getX() - this.control.getX(), this.end.getY() - this.control.getY()];
        const normOfU = Math.sqrt(u[0] * u[0] + u[1] * u[1]);
        const normOfV = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        const alpha = Math.acos((u[0]*v[0] + u[1]*v[1]) / (normOfU * normOfV));
        const theta = Math.PI - alpha;
        return theta * this.radius;
    }
}
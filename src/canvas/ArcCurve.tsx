import { Curve } from "./Curve";
import { Point } from "./Point";

export class ArcCurve extends Curve {
    radius: number;
    center: Point;

    constructor(start: Point, end: Point, control: Point) {
        super(start, end, control);
        this.center = this.computeCenter();
        this.radius = this.computeRadius();
    }

    computeCenter = (): Point => {
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
        let startAngle = Math.atan2((this.start.getY() - this.center.getY()), (this.start.getX() - this.center.getX()));
        let endAngle = Math.atan2((this.end.getY() - this.center.getY()), (this.end.getX() - this.center.getX()));

        //make sure we go in the right direction on the circle
        if (Math.abs(endAngle - startAngle) > Math.PI) {
            if (startAngle < endAngle) {
                startAngle += 2 * Math.PI;
            } else {
                endAngle += 2 * Math.PI;
            }
        }
        return new Point(this.center.getX() + this.radius * Math.cos(this.lerp(startAngle, endAngle, t)), this.center.getY() + this.radius * Math.sin(this.lerp(startAngle, endAngle, t)));
    };

    drawCurve = (path: Path2D): void => {
        path.arcTo(this.control.getX(), this.control.getY(), this.end.getX(), this.end.getY(), this.radius);
    }
}
import { Point } from './Point';
import { CurveType } from './Enums';

export class Curve {
    start: Point;
    end: Point;
    control: Point;
    type: CurveType;

    constructor (start: Point, end: Point, control: Point, type: CurveType) {
        this.start = start;
        this.end = end;
        this.control = control;
        this.type = type;
    }

    computePointsOnCurve = (numPoints: number): Point[] => {
        const resultingPoints = new Array<Point>();
        for (let i = 0; i < numPoints; i++) {
            const t = i / (numPoints - 1);
            if (this.type === CurveType.Bezier) {
                resultingPoints[i] = this.computePointOnBezier(t);
            } else if (this.type === CurveType.Arc) {
                resultingPoints[i] = this.computePointOnArc(t);
            } else {
                throw new Error();
            }
        }
        return resultingPoints;
    };

    private computePointOnBezier = (t: number): Point => {
        const startToControlX = this.lerp(this.start.getX(), this.control.getX(), t);
        const startToControlY = this.lerp(this.start.getY(), this.control.getY(), t);

        const controlToEndX = this.lerp(this.control.getX(), this.end.getX(), t);
        const controlToEndY = this.lerp(this.control.getY(), this.end.getY(), t);

        return new Point(this.lerp(startToControlX, controlToEndX, t),
                    this.lerp(startToControlY, controlToEndY, t));
    };

    private computePointOnArc = (t: number): Point => {
        const radius = this.start.getRadius(this.end, this.control);
        const center = this.start.getCenter(this.end, this.control);
        const startAngle = Math.acos((this.start.getX() - center.getX()) / radius);
        const endAngle = Math.acos((this.start.getX() - center.getX()) / radius);
        // TODO: make sure we go in the right direction on the circle
        return new Point(center.getX() + radius * Math.cos(this.lerp(startAngle, endAngle, t)), center.getY() + radius * Math.sin(this.lerp(startAngle, endAngle, t)));
    };

    private lerp = (start: number, end: number, t: number): number => {
        return start + t * (end - start);
    };
}
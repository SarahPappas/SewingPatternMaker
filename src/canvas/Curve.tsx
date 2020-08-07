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
        if (this.type === CurveType.Bezier) {
            for (let i = 0; i < numPoints; i++) {
                const t = i / (numPoints - 1);
                resultingPoints[i] = this.computePointOnBezier(t);
            }
        } else if (this.type === CurveType.Arc) {
            for (let i = 0; i < numPoints; i++) {
                const t = i / (numPoints - 1);
                resultingPoints[i] = this.computePointOnArc(t);
            }        
        } else {
            throw new Error();
        }
        return resultingPoints;
    };

    getLength = (): number => {
        let length = 0;
        // compute the total distance from start to control + from control to end in order to compute an 
        // appropriate number of points on the curve.
        const NUMPOINTS = Math.ceil((Math.sqrt(this.start.distanceSquared(this.control)) + Math.sqrt(this.control.distanceSquared(this.end))) / 5);
        const pointsOnCurve = this.computePointsOnCurve(NUMPOINTS);
        for (let i = 0; i < NUMPOINTS - 1; i++) {
            length += Math.sqrt(pointsOnCurve[i+1].distanceSquared(pointsOnCurve[i]));
        }
        return length;
    }

    // using De Casteljau's algorithm (slower but more stable than the direct approach)
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
        let startAngle = Math.atan2((this.start.getY() - center.getY()), (this.start.getX() - center.getX()));
        let endAngle = Math.atan2((this.end.getY() - center.getY()), (this.end.getX() - center.getX()));

        //make sure we go in the right direction on the circle
        if (Math.abs(endAngle - startAngle) > Math.PI) {
            if (startAngle < endAngle) {
                startAngle += 2 * Math.PI;
            } else {
                endAngle += 2 * Math.PI;
            }
        }
        return new Point(center.getX() + radius * Math.cos(this.lerp(startAngle, endAngle, t)), center.getY() + radius * Math.sin(this.lerp(startAngle, endAngle, t)));
    };

    private lerp = (start: number, end: number, t: number): number => {
        return start + t * (end - start);
    };
}
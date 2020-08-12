import { Point } from './Point';

export abstract class Curve {
    protected start: Point;
    protected end: Point;
    protected control: Point;

    constructor (start: Point, end: Point, control: Point) {
        if (start.equals(end)) {
            throw new Error("starting point of Curve must be different from end point");
        }
        this.start = start;
        this.end = end;
        this.control = control;
    }

    protected abstract computePoint(t: number): Point;

    abstract drawCurve(path: Path2D): void;

    computePointsOnCurve = (numPoints: number): Point[] => {
        const resultingPoints = new Array<Point>();
        for (let i = 0; i < numPoints; i++) {
            const t = i / (numPoints - 1);
            resultingPoints[i] = this.computePoint(t);
        }
        return resultingPoints;
    };

    getLength = (): number => {
        let length = 0;
        // compute the total distance from start to control + from control to end in order to 
        // find an upper bound on the curve length.
        const startToControl = this.start.distanceTo(this.control);
        const controlToEnd = this.control.distanceTo(this.end);
        const upperBound = Math.ceil(startToControl + controlToEnd);
        // find the number of points to take on the curve as a function of the upperbound
        const NUMPOINTS = upperBound / 5;
        const pointsOnCurve = this.computePointsOnCurve(NUMPOINTS);
        for (let i = 0; i < NUMPOINTS - 1; i++) {
            length += pointsOnCurve[i+1].distanceTo(pointsOnCurve[i]);
        }
        return length;
    };

    protected lerp = (start: number, end: number, t: number): number => {
        return start + t * (end - start);
    };
}
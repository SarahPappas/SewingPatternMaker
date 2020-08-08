import { Point } from './Point';

export abstract class Curve {
    start: Point;
    end: Point;
    control: Point;

    constructor (start: Point, end: Point, control: Point) {
        this.start = start;
        this.end = end;
        this.control = control;
    }

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
        // compute the total distance from start to control + from control to end in order to compute an 
        // appropriate number of points on the curve.
        const NUMPOINTS = Math.ceil((Math.sqrt(this.start.distanceSquared(this.control)) + Math.sqrt(this.control.distanceSquared(this.end))) / 5);
        const pointsOnCurve = this.computePointsOnCurve(NUMPOINTS);
        for (let i = 0; i < NUMPOINTS - 1; i++) {
            length += Math.sqrt(pointsOnCurve[i+1].distanceSquared(pointsOnCurve[i]));
        }
        return length;
    }

    abstract computePoint(t: number): Point;

    abstract drawCurve(path: Path2D): void;

    lerp = (start: number, end: number, t: number): number => {
        return start + t * (end - start);
    };
}
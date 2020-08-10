import { Point } from './Point';
import { Vector } from './Vector';

export abstract class Curve {
    start: Point;
    end: Point;
    control: Point;

    constructor (start: Point, end: Point, control: Point) {
        this.start = start;
        this.end = end;
        this.control = control;
    }

    abstract computePoint(t: number): Point;

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
        const startToControl = Vector.vectorBetweenPoints(this.start, this.control);
        const controlToEnd = Vector.vectorBetweenPoints(this.control, this.end);
        const upperBound = Math.ceil(startToControl.norm() + controlToEnd.norm());
        // find the number of points to take on the curve as a function of the upperbound
        const NUMPOINTS = upperBound / 5;
        const pointsOnCurve = this.computePointsOnCurve(NUMPOINTS);
        for (let i = 0; i < NUMPOINTS - 1; i++) {
            length += Math.sqrt(pointsOnCurve[i+1].distanceSquared(pointsOnCurve[i]));
        }
        return length;
    }

    lerp = (start: number, end: number, t: number): number => {
        return start + t * (end - start);
    };
}
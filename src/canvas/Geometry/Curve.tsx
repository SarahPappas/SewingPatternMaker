import { Point } from './Point';
import { Segment } from './Segment';
import { Vector } from './Vector';

export abstract class Curve extends Segment {
    protected control: Point;

    constructor (start: Point, end: Point, control: Point) {
        super(start, end);
        this.control = control;
    }

    protected abstract computePoint(t: number): Point;

    computePointsOnCurve = (numPoints: number): Point[] => {
        const resultingPoints = new Array<Point>();
        for (let i = 0; i < numPoints; i++) {
            const t = i / (numPoints - 1);
            resultingPoints[i] = this.computePoint(t);
        }
        return resultingPoints;
    };

    // Overrides abstract class in parent.
    getLength = (): number => {
        let length = 0;
        // Compute the total distance from start to control + from control to end in order to 
        // find an upper bound on the curve length.
        const startToControl = this.start.distanceTo(this.control);
        const controlToEnd = this.control.distanceTo(this.end);
        const upperBound = Math.ceil(startToControl + controlToEnd);
        // We arbitrarily decide that the number of points to take on the curve is equal to
        // the number of points that is necessary to have one point every n pixels 
        // on a line of length equal to upperBound. We call 1 / n the PRECISION factor.
        // A precision factor of 0.2 empirically works well. A precision factor of 1 
        // would yield roughly 1 point every pixel.
        const PRECISION = 0.2;
        const NUMPOINTS = upperBound * PRECISION;
        const pointsOnCurve = this.computePointsOnCurve(NUMPOINTS);
        for (let i = 0; i < NUMPOINTS - 1; i++) {
            length += pointsOnCurve[i+1].distanceTo(pointsOnCurve[i]);
        }
        return length;
        // TODO: We could make this method more rigorous by getting points on the curve one by
        //       one. Everytime we get a new point, we first check if it is close enough to the 
        //       previous point, and if it is not we ask for another point that is closer on 
        //       the curve instead. This would allow us to bound our error on the total length. 
    };

    getTangent = (t: number): Vector => {
        if (!(t === 0 || t === 1)) {
            throw new Error();
        }
        if (t === 0) {
            return Vector.vectorBetweenPoints(this.start, this.control);
        } else { // t === 1
            return Vector.vectorBetweenPoints(this.control, this.end);
        }
    }

    protected lerp = (start: number, end: number, t: number): number => {
        return start + t * (end - start);
    };
}
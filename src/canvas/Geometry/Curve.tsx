import { Point } from './Point';
import { Segment } from './Segment';
import { Vector } from './Vector';

export abstract class Curve extends Segment {
    protected control: Point;

    constructor (start: Point, end: Point, control: Point) {
        super(start, end);
        this.control = control.clone();
    }

    computePoints = (numPoints?: number): Point[] => {
        numPoints = numPoints || 100;
        const resultingPoints = new Array<Point>();
        for (let i = 0; i < numPoints; i++) {
            const t = i / (numPoints - 1);
            resultingPoints[i] = this._computePoint(t);
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
        const pointsOnCurve = this.computePoints(NUMPOINTS);
        for (let i = 0; i < NUMPOINTS - 1; i++) {
            length += pointsOnCurve[i+1].distanceTo(pointsOnCurve[i]);
        }
        return length;
        // TODO: We could make this method more rigorous by getting points on the curve one by
        //       one. Everytime we get a new point, we first check if it is close enough to the 
        //       previous point, and if it is not we ask for another point that is closer on 
        //       the curve instead. This would allow us to bound our error on the total length. 
    };

    /**
     * Returns a vector that is tangent to the curve at the position indicated by
     * the parameter t.
     * 
     * @param t Describes the position on the curve where we want the tangent vector.
     *          t should be equal to 0 or 1, 0 for the start of the curve, 1 for the end
     */
    getTangent = (t: number): Vector => {
        // TODO: for seam allowances, implement this for all values of t between 0 and 1
        if (!(t === 0 || t === 1)) {
            throw new Error();
        }
        if (t === 0) {
            return Vector.vectorBetweenPoints(this.start, this.control);
        } else { // t === 1
            return Vector.vectorBetweenPoints(this.control, this.end);
        }
    };

    /* 
     * Returns null if a point is not near the segement, otherwise it returns the closest
     * point on the segment. Checks if a point is near the curve by computing a number of 
     * points on that curve, finding the point among those that is closest to the inputted point,
     * and then checking if that point is within a radius at the given threshold.
    */
    isPointNearSegment = (point: Point, threshold: number): Point | null => {
        const NUMPOINTS = 100;
        const pointsOnCurve = this.computePoints(NUMPOINTS);
        const indexOfClosestPoint = this._indexOfClosestPointOnCurve(point, pointsOnCurve);

        if (point.isWithinRadius(pointsOnCurve[indexOfClosestPoint], threshold)) {
            return pointsOnCurve[indexOfClosestPoint];
        } else {
            return null;
        }
    };

    protected _indexOfClosestPointOnCurve = (point: Point, pointsOnCurve: Point[]): number => {
        let minDist = point.distanceTo(pointsOnCurve[0]);
        let closestPointIndex = 0;
        for (let i = 1; i < pointsOnCurve.length; i++) {
            const dist = point.distanceTo(pointsOnCurve[i]);
            if (dist < minDist) {
                minDist = dist;
                closestPointIndex = i;
            }
        }
        return closestPointIndex;
    };

    protected lerp = (start: number, end: number, t: number): number => {
        return start + t * (end - start);
    };

    protected abstract _computePoint(t: number): Point;
}
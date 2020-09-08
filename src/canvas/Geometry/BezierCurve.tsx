import { Point } from './Point';
import { Curve } from './Curve';
import { Segment } from './Segment';
import { Vector } from './Vector';

export class BezierCurve extends Curve {
    // Precondition: split is a point on the curve.
    split = (point: Point): BezierCurve[] => {
        const curves:  BezierCurve[] = [];
        const t = this._findT(point);
        const pointOnCurve = this._computePoint(t);

        let controlPointX = this.lerp(this.start.x, this.control.x, t);
        let controlPointY = this.lerp(this.start.y, this.control.y, t);
        curves.push(new BezierCurve(this.start, pointOnCurve, new Point(controlPointX, controlPointY)));

        controlPointX = this.lerp(this.control.x, this.end.x, t);
        controlPointY = this.lerp(this.control.y, this.end.y, t);
        curves.push(new BezierCurve(pointOnCurve, this.end, new Point(controlPointX, controlPointY)));

        return curves;
    }; 

    private _findT = (point: Point): number => {
        // TODO: we tried finding t using direct calculation methods
        // (solving for t in a pair of parametric equations from 
        // P = (1-t2)S + 2t(1-t)C + t2E) but that leads to many different
        // cases. Need more thought to make this method fail safe.

        // TODO: this method may fail if the bezier curve is too long:
        // the tested point might slip in between 2 of the computed points        
        const NUMPOINTS = 100;
        const pointsOnCurve = this.computePoints(NUMPOINTS);
        const indexOfClosestPoint = this._indexOfClosestPointOnCurve(point, pointsOnCurve);

        if (!point.isWithinRadius(pointsOnCurve[indexOfClosestPoint], 10)){
            throw new Error("the point is not on the curve");
        } 
        
        return indexOfClosestPoint / NUMPOINTS;
    };

    // Returns a point on the Bezier curve between its start point and
    // its end point. If t=0, it returns the starting point. If t=1, 
    // it returns the end point.
    // Overrides abstract method in parent
    // Precondition: t is a number between 0 and 1
    protected _computePoint = (t: number): Point => {
        // Using De Casteljau's algorithm instead of the parametric equation.
        // This method is slower but more stable.
        const startToControlX = this.lerp(this.start.x, this.control.x, t);
        const startToControlY = this.lerp(this.start.y, this.control.y, t);

        const controlToEndX = this.lerp(this.control.x, this.end.x, t);
        const controlToEndY = this.lerp(this.control.y, this.end.y, t);

        return new Point(this.lerp(startToControlX, controlToEndX, t),
                    this.lerp(startToControlY, controlToEndY, t));
    };

    // Overrides the abstract method in parent class.
    drawTo = (path: Path2D): void => {
        path.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y);   
    };
    
    getTangent = (t: number): Vector => {
        const x = -2 * (1 - t) * this.start.x + (2 - 4 * t) * this.control.x + 2 * t * this.end.x;
        const y = -2 * (1 - t) * this.start.y + (2 - 4 * t) * this.control.y + 2 * t * this.end.y;
        return new Vector(x, y);
    };

    getOffsetSegments = (distance: number): Segment[] => {
        // Compute offset points
        const offsetPoints: Point[] = [];
        const NUMPOINTS = 20;
        const numSegments = NUMPOINTS - 1;
        for (let t = 0; t <= 1; t += (1 / numSegments)) {
            const pointOnBezier = this._computePoint(t);
            const displacement = Vector.findOpposite(Vector.findPerpVector(this.getTangent(t))).normalize().multiplyByScalar(distance);
            offsetPoints.push(Point.translate(pointOnBezier, displacement));
        }

        // Construct an array of BezierCurves that link the offset points
        const result: Segment[] = [];
        let middle = Point.computeMiddlePoint(offsetPoints[1], offsetPoints[2]);
        result.push(new BezierCurve(offsetPoints[0], middle, offsetPoints[1]));
        for (let i = 1; i < NUMPOINTS - 3; i++) {
            const prevMiddle = middle;
            middle = Point.computeMiddlePoint(offsetPoints[i + 1], offsetPoints[i + 2]);
            result.push(new BezierCurve(prevMiddle, middle, offsetPoints[i + 1]));
        }
        result.push(new BezierCurve(middle, offsetPoints[NUMPOINTS - 1], offsetPoints[NUMPOINTS - 2]));
        return result;
    };

    translate = (displacement: Vector): void => {
        this.start = Point.translate(this.start, displacement);
        this.control = Point.translate(this.control, displacement);
        this.end = Point.translate(this.end, displacement);
    };

    clone = (): BezierCurve => {
        return new BezierCurve(this.start, this.end, this.control);
    };

    reversedClone = (): BezierCurve => {
        return new BezierCurve(this.end, this.start, this.control);
    };

    protected _equals = (other: Segment): boolean => {
        return (other instanceof BezierCurve) && this.control.equals(other.control);
    };
}

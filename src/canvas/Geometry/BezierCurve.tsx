import { Point } from './Point';
import { Curve } from './Curve';
import { Segment } from './Segment';
import { Vector } from './Vector';

export class BezierCurve extends Curve {
    clone = (): BezierCurve => {
        return new BezierCurve(this.start, this.end, this.control);
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

    reversedClone = (): BezierCurve => {
        return new BezierCurve(this.end, this.start, this.control);
    };

    // Precondition: split is a point on the curve.
    split = (point: Point): BezierCurve[] => {
        // Using de Casteljau's algorithm to find the control points
        // of the 2 new curves.
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

    translate = (displacement: Vector): void => {
        this.start = Point.translate(this.start, displacement);
        this.control = Point.translate(this.control, displacement);
        this.end = Point.translate(this.end, displacement);
        this.points = this.computePoints();
    };

    /** 
    * Returns a point on the Bezier curve between its start point and
    * its end point. If t=0, it returns the starting point. If t=1, 
    * it returns the end point.
    * Overrides abstract method in parent
    * Precondition: t is a number between 0 and 1
    */
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

    /**
     * Finds the solution(s) to the equation at^2 + bt + c = 0, where t is the
     * unknown and a, b, and c are input as parameters.
     * Throws if there are 0 solutions. Returns undefined if all values of t are solutions.
     * Otherwise, will return an array containing one or two solutions.
     * @param a coefficient of t^2
     * @param b coefficient of t
     * @param c constant term
     */
    private _solveQuadratic = (a: number, b: number, c: number): number[] | undefined => {
        if (a === 0) {
            if (b === 0) {
                if (c === 0) {
                    // if a = b = c = 0, there are infinitely many
                    // solutions.
                    return undefined;
                } else { // if a = b = 0 but c != 0, 
                         // this means the point is not on the curve.
                    throw new Error("the point is not on the curve");
                }
            } else { // a = 0 and b != 0 means the equation is linear
                return [-1 * c / b];
            }            
        }
        // if a != 0 then the equation is quadratic
        const result: number[] = [];
        const d = b * b - 4 * a * c; // d is the discriminant
        if (d === 0) {
            result.push((-1 * b) / (2 * a));
        } else if (d > 0) {
            result.push(((-1 * b) + Math.sqrt(d)) / (2 * a));
            result.push(((-1 * b) - Math.sqrt(d)) / (2 * a));
        } else { // d < 0
            throw new Error("the point is not on the curve");
        }
        return result;
    };

    private _findT = (point: Point): number => {
        const solx = this._solveQuadratic(this.start.x - 2 * this.control.x + this.end.x, 2 * (this.control.x - this.start.x), this.start.x - point.x);
        if (solx === undefined) { // Any value of t will satisfy the x equation, 
                                  // therefore we consider the y equation to find t 
            const soly = this._solveQuadratic(this.start.y - 2 * this.control.y + this.end.y, 2 * (this.control.y - this.start.y), this.start.y - point.y);
            if (soly === undefined) {
                // If both the x and the y equations have infinitely many solutions, then the
                // start, end, control and the tested point are all the same. This is prevented by the 
                // constructor.
                throw new Error("start, end, control and the point are all the same");
            } else {
                // No matter if the y equation has 1 or 2 solutions, any solution will do.
                return soly[0];
            }
        } else if (solx.length === 1) {
            return solx[0];
        } else { // we have 2 possible values of t from the x equation, so we examine the y equation.
            const soly = this._solveQuadratic(this.start.y - 2 * this.control.y + this.end.y, 2 * (this.control.y - this.start.y), this.start.y - point.y);
            if (soly === undefined) {
                // the y equation has infinitely many solutions,
                // so any of the 2 solutions for x will do
                return solx[0];
            } else { // soly has one or two elements, solx has 2. return the solution in solx that is closest to one of the solutions in soly.
                let firstElementOfClosestPair = solx[0];
                let smallestDifference = Number.MAX_VALUE;
                for (let i = 0; i < solx.length; i++) {
                    for (let j = 0; j < soly.length; j++) {
                        if (Math.abs(solx[i] - soly[j]) < smallestDifference){
                            firstElementOfClosestPair = solx[i];
                            smallestDifference = Math.abs(solx[i] - soly[j]);
                        }
                    }
                }
                return firstElementOfClosestPair;
            }
        }
    };

    protected _equals = (other: Segment): boolean => {
        return (other instanceof BezierCurve) && this.control.equals(other.control);
    };

    protected _scale = (scalar: number): void => {
        this.start = this.start.scale(scalar);
        this.control = this.control.scale(scalar);
        this.end = this.end.scale(scalar);
        this.points = this.computePoints();
    };
}
import { Point } from './Point';
import { Curve } from './Curve';

export class BezierCurve extends Curve {
    // Precondition: split is a point on the curve.
    split = (point: Point): BezierCurve[] => {
        const curves:  BezierCurve[] = [];
        const t = this._findT(point);

        let controlPointX = this.lerp(this.start.x, this.control.x, t);
        let controlPointY = this.lerp(this.start.y, this.control.y, t);
        curves.push(new BezierCurve(this.start, point, new Point(controlPointX, controlPointY)));

        controlPointX = this.lerp(this.control.x, this.end.x, t);
        controlPointY = this.lerp(this.control.y, this.end.y, t);
        curves.push(new BezierCurve(point, this.end, new Point(controlPointX, controlPointY)));

        return curves;
    }; 

    private _solveQuadratic = (a: number, b: number, c: number): number[] => {
        const result: number[] = [];
        const d = b * b - 4 * a * c; // d is the discriminant
        if (d === 0) {
            result.push((-1 * b) / (2 * a));
        } else if (d > 0) {
            result.push(((-1 * b) + Math.sqrt(d)) / (2 * a));
            result.push(((-1 * b) - Math.sqrt(d)) / (2 * a));
        }
        return result;
    };

    private _findT = (point: Point): number => {
        const solx = this._solveQuadratic(this.start.x - 2 * this.control.x + this.end.x, 2 * (this.control.x - this.start.x), this.start.x - point.x);
        const soly = this._solveQuadratic(this.start.y - 2 * this.control.y + this.end.y, 2 * (this.control.y - this.start.y), this.start.y - point.y);
        const solInCommon = solx.filter(sx => soly.some(sy => Math.abs(sx - sy) < 1e-3));
        
        if (solInCommon.length !== 1) {
            throw new Error("could not find t");
        }
        return solInCommon[0];
    };

    // Returns a point on the Bezier curve between its start point and
    // its end point. If t=0, it returns the starting point. If t=1, 
    // it returns the end point.
    // Overrides abstract method in parent
    // Precondition: t is a number between 0 and 1
    protected computePoint = (t: number): Point => {
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
    protected _drawTo = (path: Path2D): void => {
        path.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y);   
    };
}

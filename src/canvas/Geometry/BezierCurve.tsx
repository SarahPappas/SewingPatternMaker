import { Point } from './Point';
import { Curve } from './Curve';

export class BezierCurve extends Curve {
    // Precondition: split is a point on the curve.
    split = (point: Point): BezierCurve[] => {
        const curves:  BezierCurve[] = [];

        const NUMPOINTS = 100;
        const points = this.computePoints();
        const startPoint = points[0];
        const endPoint = points[points.length - 1];

        let index = -1;
        points.forEach((pt, i) => { 
            if (pt.isWithinRadius(point, 10)) {
                index = i;
                return true;
            }
        });
        console.log("BezierCurveIndex split index", index);

        const t: number = index / NUMPOINTS;
        let controlPointX = (1 - t) * startPoint.x + t * this.control.x;
        let controlPointY = (1 - t) * startPoint.y + t * this.control.y;
        curves.push(new BezierCurve(startPoint, point, new Point(controlPointX, controlPointY)));

        controlPointX = (1 - t) * this.control.x + t * this.end.x;
        controlPointY = (1 - t) * this.control.y + t * this.end.y;
        curves.push(new BezierCurve(point, endPoint, new Point(controlPointX, controlPointY)));

        return curves;
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

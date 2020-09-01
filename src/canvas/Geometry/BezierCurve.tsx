import { Point } from './Point';
import { Curve } from './Curve';

export class BezierCurve extends Curve {
    // Precondition: split is a point on the curve.
    split = (point: Point): BezierCurve[] => {
        const curves:  BezierCurve[] = [];
        const t = this._findT(point);
        const pointOnCurve = this.computePoint(t);

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
        const points = this.computePoints();
        let index = -1;
        points.forEach((pt, i) => { 
            if (pt.isWithinRadius(point, 10)) {
                index = i;
                return true;
            }
        });

        if (index === -1) {
            throw new Error("the point is not on the curve");
        }
        
        return index / NUMPOINTS;
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
    drawTo = (path: Path2D): void => {
        path.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y);   
    };
}

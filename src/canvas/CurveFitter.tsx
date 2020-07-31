import { Point } from './Point';
import { Curve } from './Curve';

export class CurveFitter {
    private _points: Point[];
    private _splitsIndex: number[];
    
    constructor (points: Point[]) {
        this._points = points;
        this._splitsIndex = new Array<number>();
    }

    Fit = (points: Point[]): Curve => {
        // If there are two points or less, return void becuase this cannnot be fit to a curve.
        if (points.length <= 2) {
            throw new Error("not enough points");
        }

        const startPoint = points[0];
        const endPoint = points[points.length -1];

        const PARAM = 50;

        const controlPoint = startPoint.getPointOnMidline(endPoint, PARAM);

        return new Curve(startPoint, endPoint, controlPoint); 
    };

    FitLine = (): Path2D => {
        const curve = this.Fit(this._points);
        const path = new Path2D();
        path.moveTo(curve.start.getX(), curve.start.getY());
        // path.lineTo(curve.end.getX(), curve.end.getY());
        // path.lineTo(curve.control.getX(), curve.control.getY());
        // const center = curve.start.getCenter(curve.end, curve.control);
        // path.lineTo(center.getX(), center.getY());
        // path.lineTo(curve.start.getX(), curve.start.getY());
        path.arcTo(curve.control.getX(), curve.control.getY(), curve.end.getX(), curve.end.getY(), curve.start.getRadius(curve.end, curve.control));
        return path;
    }
}


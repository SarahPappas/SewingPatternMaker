import { Point } from './Point';
import { PatternPathType } from './PatternPathType';

export class PatternPath implements IPatternPath {
    private _points: Point[];
    private _type: PatternPathType;
    private _pathCanvas2D: Path2D | null;
    private _isPathCanvas2DInvalid: boolean;

    constructor (pathType: PatternPathType) {
        this._type = pathType;
        this._points = new Array<Point> ();
        this._pathCanvas2D = null;
        this._isPathCanvas2DInvalid = true;
    };

    getPoints = (): Point[] => {
        return this._points;
    };

    getType = (): PatternPathType => {
        return this._type;
    };

    getPathCanvas2D = (): Path2D | null => {
        if (!this._isPathCanvas2DInvalid) {
            return this._pathCanvas2D;
        }

        if (!this._points.length || !this._pathCanvas2D) {
            return null;
        }

        let currPointIndex = this._points.length - 1;
        let currPoint = this._points[currPointIndex];
        this._pathCanvas2D.lineTo(currPoint.getX(), currPoint.getY());
        return this._pathCanvas2D;
    };

    addPoint = (point: Point): Point[] => {
        this._isPathCanvas2DInvalid = true;
        return this._points;
    };
}
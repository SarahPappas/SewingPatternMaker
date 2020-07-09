import { Point } from './Point';
import { PatternPathType } from './Enums';

export class PatternPath implements IPatternPath {
    private _points: Point[];
    private _type: PatternPathType;
    private _path2D: Path2D;
    private _isPathCanvas2DInvalid: boolean;
    private _lastIndexAddedToCanvas2DPath: number;

    constructor (pathType: PatternPathType) {
        this._type = pathType;
        this._points = new Array<Point>();
        this._path2D = new Path2D();
        this._isPathCanvas2DInvalid = true;
        this._lastIndexAddedToCanvas2DPath = -1;
    }

    getPoints = (): Point[] => {
        return this._points;
    };

    getType = (): PatternPathType => {
        return this._type;
    };

    getPathCanvas2D = (): Path2D => {
        if (!this._isPathCanvas2DInvalid || !this._points.length) {
            return this._path2D;
        }

        if (this._points.length === 1) {
            this._path2D.moveTo(this._points[0].getX(), this._points[0].getY());
        }

        const lastPointIndex = this._points.length - 1;
        for (let i = this._lastIndexAddedToCanvas2DPath + 1; i < this._points.length; i++) {
            const currPoint = this._points[i];
            this._path2D.lineTo(currPoint.getX(), currPoint.getY());
        }
    
        return this._path2D;
    };

    addPoint = (point: Point): boolean => {
        if (this._points.length) {
            const prevPoint = this._points[this._points.length - 1];
            if (prevPoint.equals(point)) {
                return false;
            }
        }
        
        this._points.push(point);
        this._isPathCanvas2DInvalid = true;
        return true;
    };
}
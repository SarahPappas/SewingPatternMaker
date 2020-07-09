import { Point } from './Point';
import { PatternPathType } from './Enums';

export class PatternPath implements IPatternPath {
    private _points: Point[];
    private _type: PatternPathType;
    private _path2D: Path2D;
    private _isPath2DInvalid: boolean;
    private _lastIndexAddedTo2DPath: number;

    constructor (pathType: PatternPathType) {
        this._type = pathType;
        this._points = new Array<Point>();
        this._path2D = new Path2D();
        this._isPath2DInvalid = true;
        this._lastIndexAddedTo2DPath = -1;
    }

    getPoints = (): Point[] => {
        return this._points;
    };

    getType = (): PatternPathType => {
        return this._type;
    };

    getPath2D = (): Path2D => {
        if (!this._isPath2DInvalid) {
            return this._path2D;
        }

        if (this._lastIndexAddedTo2DPath === -1 && this._points.length) {
            this._path2D.moveTo(this._points[0].getX(), this._points[0].getY());
            this._lastIndexAddedTo2DPath++;
        }

        if (!this._lastIndexAddedTo2DPath && this._lastIndexAddedTo2DPath === this._points.length -1) {
            this._isPath2DInvalid = false;
            return this._path2D;
        }

        const currPoint = this._points[this._points.length - 1];
        const prevPoint = this._points[this._lastIndexAddedTo2DPath];

        const midPoint = this._computeMiddlePoint(prevPoint, currPoint);
        this._path2D.quadraticCurveTo(currPoint.getX(), currPoint.getY(), midPoint.getX(), midPoint.getY());

        this._lastIndexAddedTo2DPath = this._points.length - 1;
        this._isPath2DInvalid = false;
    
        return this._path2D;
    };

    addPoint = (point: Point): boolean => {
        if (!this._points.length) {
            this._points.push(point);
            this._isPath2DInvalid = true;
            return true;
        }

        const prevPoint = this._points[this._points.length - 1];
        if (prevPoint.equals(point)) {
            return false;
        }

        this._points.push(point);
        this._isPath2DInvalid = true;
        return true;
    };

    private _computeMiddlePoint = (point1: Point, point2: Point): Point => {
        const middleX = (point1.getX() + point2.getX()) / 2;
        const middleY = (point1.getY() + point2.getY()) / 2;
        
        return new Point(middleX, middleY);
    }
}
import { Point } from './Point';
import { PatternPathType } from './Enums';

export class PatternPath implements IPatternPath {
    private _points: Point[];
    private _type: PatternPathType;
    private _path2D: Path2D;
    private _isPath2DValid: boolean;
    private _lastIndexAddedToPath2D: number;
    private n: number;

    constructor (pathType: PatternPathType) {
        this._type = pathType;
        this._points = new Array<Point>();
        this._path2D = new Path2D();
        this._isPath2DValid = false;
        this._lastIndexAddedToPath2D = -1;
        this.n = 0;
    }

    getPoints = (): Point[] => {
        return this._points;
    };

    getType = (): PatternPathType => {
        return this._type;
    };

    getPath2D = (): Path2D => {
        // If the Path2D is already valid, return it.
        if (this._isPath2DValid) {
            return this._path2D;
        }

        // If it is the first time we are adding a point to the Path2D, use moveTo.
        if (this._lastIndexAddedToPath2D === -1 && this._points.length) {
            this._path2D.moveTo(this._points[0].getX(), this._points[0].getY());
            this._lastIndexAddedToPath2D++;
        }

        // If the path2D only has 1 item in it and there are not more points to add to the path2D, 
        // then the path is valid and we can return it.
        if (!this._lastIndexAddedToPath2D && this._lastIndexAddedToPath2D === this._points.length - 1) {
            this._isPath2DValid = true;
            return this._path2D;
        }

        // Otherwise, continue adding to the Path2D. We do not need to loop through all of the points.
        // Instead we can approximate the curve from the last point that was added to the path2D and the
        // most recent point added to the paths array.
        this._updatePath2DWithQuadraticCurve();

        this._lastIndexAddedToPath2D = this._points.length - 1;
        this._isPath2DValid = true;
    
        return this._path2D;
    };

    addPoint = (point: Point): boolean => {
        // If the points array is empty, we can just add the point.
        if (!this._points.length) {
            this.n=0;
            this._points.push(point);
            this._isPath2DValid = false;
            return true;
        }
        this.n++;

        // only keep one out of 10 points to smooth the line
        if (this.n % 10 !== 0) {
            return false;
        }

        // If not, then we can add the point.
        this._points.push(point);
        this._isPath2DValid = false;
        return true;
    };

    private _computeMiddlePoint = (point1: Point, point2: Point): Point => {
        const middleX = (point1.getX() + point2.getX()) / 2;
        const middleY = (point1.getY() + point2.getY()) / 2;
        
        return new Point(middleX, middleY);
    }

    /* 
    * The algorithm for starting and ending the line is not quite right. The first segment of the path will be 
    * a straight line because a bezier curve with a control point equal to one of is extremities points will 
    * just be a line. Additionally, The line will not end on the exact last point. Instead, it will end on the 
    * middle of the last two points. We decided this is okay for now, but may need to be updated in the future.
    */
    private _updatePath2DWithQuadraticCurve = (): void => {
        const currPoint = this._points[this._points.length - 1];
        const prevPoint = this._points[this._lastIndexAddedToPath2D];

        const midPoint = this._computeMiddlePoint(prevPoint, currPoint);
        this._path2D.quadraticCurveTo(prevPoint.getX(), prevPoint.getY(), midPoint.getX(), midPoint.getY());
    }
}
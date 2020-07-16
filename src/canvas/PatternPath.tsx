import { Point } from './Point';
import { PatternPathType } from './Enums';

export class PatternPath implements IPatternPath {
    private _points: Point[];
    private _smoothPoints: Point[];
    private _type: PatternPathType;
    private _path2D: Path2D;
    private _isPath2DValid: boolean;
    private _lastIndexAddedToPath2D: number;

    constructor (pathType: PatternPathType) {
        this._type = pathType;
        this._points = new Array<Point>();
        this._smoothPoints = new Array<Point>();
        this._path2D = new Path2D();
        this._isPath2DValid = false;
        this._lastIndexAddedToPath2D = -1;
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
        if (this._lastIndexAddedToPath2D === 0 && this._points.length === 1) {
            this._isPath2DValid = true;
            return this._path2D;
        }

        // Otherwise, continue adding to the Path2D. We do not need to loop through all of the points.
        // Instead we can approximate the curve from the last point that was added to the path2D and the
        // Most recent point added to the paths array.
        this._updatePath2DWithQuadraticCurve();

        this._lastIndexAddedToPath2D = this._points.length - 1;
        this._isPath2DValid = true;
        
        return this._path2D;
    };

    addPoint = (point: Point): boolean => {
        // If the points array is empty, we can just add the point.
        if (!this._points.length) {
            this._points.push(point);
            this._isPath2DValid = false;
            return true;
        }
        
        // Otherwise, we check if the if the point we want to add is equal to the last point that was added.
        const prevPoint = this._points[this._points.length - 1];
        if (prevPoint.equals(point)) {
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

    private _squaredDistance = (point1: Point, point2: Point): number => {
        const dx = point2.getX() - point1.getX();
        const dy = point2.getY() - point1.getY();
        return dx*dx + dy*dy;
    }

    public smoothLine = (): void => {
        if (this._points.length > 2) {
            this._smoothPoints = new Array<Point>();        
            this._smoothPoints.push(this._points[0]);
            let lastIndexTaken = 0;
            for(let i = 0;i < this._points.length - 1;i++) {
                if (i - lastIndexTaken >= 10 && this._squaredDistance(this._points[i], this._points[lastIndexTaken]) > 30){
                    this._smoothPoints.push(this._points[i]);
                    lastIndexTaken = i;
                }
            }
            this._smoothPoints.push(this._points[this._points.length - 1]);
            if (this._smoothPoints.length > 2) {
                this._path2D = new Path2D();
                this._isPath2DValid = true;

                console.log("points has " + this._points.length + " points");
                console.log("smoothPoints has " + this._smoothPoints.length + " points");
                this._path2D.moveTo(this._smoothPoints[0].getX(), this._smoothPoints[0].getY());
                let i: number;
                for (i = 1;i < this._smoothPoints.length - 2;i++) {
                    const midPoint = this._computeMiddlePoint(this._smoothPoints[i], this._smoothPoints[i+1]);
                    this._path2D.quadraticCurveTo(this._smoothPoints[i].getX(), this._smoothPoints[i].getY(), midPoint.getX(), midPoint.getY());
                }
                this._path2D.quadraticCurveTo(this._smoothPoints[i].getX(), this._smoothPoints[i].getY(), this._smoothPoints[i+1].getX(), this._smoothPoints[i+1].getY());
            }
        }
    }
}
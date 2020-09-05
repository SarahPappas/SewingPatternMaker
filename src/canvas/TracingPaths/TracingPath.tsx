import { Point } from '../Geometry/Point';
import { PatternPath } from 'canvas/PatternPaths/PatternPath';

export abstract class TracingPath implements ITracingPath {
    protected _points: Point[];
    protected _path2D: Path2D;
    protected _isPath2DValid: boolean;
    protected _lastIndexAddedToPath2D: number;

    constructor () {
        this._points = new Array<Point>();
        this._path2D = new Path2D();
        this._isPath2DValid = false;
        this._lastIndexAddedToPath2D = -1;
    }

    getPoints = (): Point[] => {
        return this._points;
    };

    getPath2D = (): Path2D => {
        // If the Path2D is already valid, return it.
        if (this._isPath2DValid) {
            return this._path2D;
        }

        // If it is the first time we are adding a point to the Path2D, use moveTo.
        if (this._lastIndexAddedToPath2D === -1 && this._points.length) {
            this._path2D.moveTo(this._points[0].x, this._points[0].y);
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
        this._updatePath2D();

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
        this._addPoint(point);
        this._isPath2DValid = false;
        return true;
    };

    /**
     * Returns true if the start point was snapped to an endpoint of a pattern path.
     * Otherwise, it returns false.
     * 
     * @param patternPaths A list of pattern paths whose endpoints we will compare to the
     * start point.
     */
    snapStartPoint = (patternPaths: PatternPath[]): boolean => {
        return this._snapEndPoints(patternPaths, 0);
    };

    /**
     * Sets the start point of the tracing path to the given point.
     * 
     * @param point A point where the tracing path should start.
     */
    snapStartPointTo = (point: Point): void => {
        this._points[0] = point;    
    };

    /**
     * Returns true if the last point was snapped to an endpoint of a pattern path.
     * Otherwise, it returns false.
     * 
     * @param patternPaths A list of pattern paths whose endpoints we will compare to the
     * last point.
     */
    snapEndPoint = (patternPaths: PatternPath[]): boolean => {
        const updatedEndPoint = this._snapEndPoints(patternPaths, this._points.length - 1);
        if (updatedEndPoint) {
            this._updatePath2D();
        }
        return updatedEndPoint;
    };

    /**
     * Sets the end point of the tracing path to the given point.
     * 
     * @param point A point where the tracing path should end.
     */
    snapEndPointTo = (point: Point): void => {
        this._points[this._points.length - 1] = point;    
    };

    private _snapEndPoints = (patternPaths: PatternPath[], index: number): boolean => {
        const point = this._points[index];
        // Radius to check within to see if we should snap to point.
        const radius = 10;
        let updatedPoint = false;

        for (let i = 0; i < patternPaths.length; i++) {
            const patternPath = patternPaths[i];

            if(!updatedPoint && point.isWithinRadius(patternPath.getStart(), radius)) {
                this._points[index] = patternPath.getStart();
                updatedPoint = true;
            }

            if(!updatedPoint && point.isWithinRadius(patternPath.getEnd(), radius)) {
                this._points[index] = patternPath.getEnd();
                updatedPoint = true;
            }
        }

        return updatedPoint;
    };

    protected abstract _updatePath2D(): void;
    protected abstract _addPoint(point: Point): void;
}
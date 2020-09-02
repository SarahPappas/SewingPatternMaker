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

    snapStartToPoint = (point: Point): void => {
        this._points[0] = point;
    };

    snapEndToPoint = (point: Point): void => {
        this._points[this._points.length -1] = point;
    };

    snapEndpoints = (paths: PatternPath[], snapStart: boolean, snapEnd: boolean, point?: Point): boolean => {
        const myFirstPoint = snapStart && point ? point : this._points[0];
        const myLastPoint = snapEnd && point ? point : this._points[this._points.length - 1];
        // Radius to check within to see if we should snap to point.
        const radius = 10;
        let updatedFirstPoint = false;
        let updatedLastPoint = false;

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const points = path.getPoints();

            const otherFirstPoint = points[0];
            const otherLastPoint = points[points.length - 1];

            if(snapStart && !updatedFirstPoint && myFirstPoint.isWithinRadius(otherFirstPoint, radius)) {
                this.snapStartToPoint(otherFirstPoint);
                updatedFirstPoint = true;
            }

            if(snapStart && !updatedFirstPoint && myFirstPoint.isWithinRadius(otherLastPoint, radius)) {
                this.snapStartToPoint(otherLastPoint);
                updatedFirstPoint = true;
            }

            if(snapEnd && !updatedLastPoint && myLastPoint.isWithinRadius(otherFirstPoint, radius)) {
                this.snapEndToPoint(otherFirstPoint);
                updatedLastPoint = true;
            }

            if(snapEnd && !updatedLastPoint && myLastPoint.isWithinRadius(otherLastPoint, radius)) {
                this.snapEndToPoint(otherLastPoint);
                updatedLastPoint = true;
            }

        }

        if (updatedFirstPoint || updatedLastPoint) {
            this._updatePath2D();
            return true;
        }

        return false;
    };

    protected abstract _updatePath2D(): void;
    protected abstract _addPoint(point: Point): void;
}
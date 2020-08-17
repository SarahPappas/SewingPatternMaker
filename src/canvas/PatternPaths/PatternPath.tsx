import { Point } from '../Geometry/Point';
import { PatternPathType } from '../Enums';
import { Segment } from 'canvas/Geometry/Segment';

export abstract class PatternPath implements IPatternPath {
    protected _points: Point[];
    protected _type: PatternPathType;
    protected _path2D: Path2D;
    protected _isPath2DValid: boolean;
    protected _lastIndexAddedToPath2D: number;
    protected _fittedSegment: Segment | null;

    constructor (pathType: PatternPathType) {
        this._type = pathType;
        this._points = new Array<Point>();
        this._path2D = new Path2D();
        this._isPath2DValid = false;
        this._lastIndexAddedToPath2D = -1;
        this._fittedSegment = null;
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
        this._points.push(point);
        this._isPath2DValid = false;
        return true;
    };

    snapEndpoints = (paths: PatternPath[]): void => {
        const myFirstPoint = this._points[0];
        const myLastPoint = this._points[this._points.length - 1];
        // Radius to check within to see if we should snap to point.
        const radius = 10;
        let updatedFirstPoint = false;
        let updatedLastPoint = false;

        paths.forEach(path => {
            if (path === this) {
                return;
            }
            const points = path.getPoints();

            const otherFirstPoint = points[0];
            const otherLastPoint = points[points.length - 1];

            if(!updatedFirstPoint && myFirstPoint.isWithinRadius(otherFirstPoint, radius)) {
                this._points[0] = otherFirstPoint;
                updatedFirstPoint = true;
            }

            if(!updatedFirstPoint && myFirstPoint.isWithinRadius(otherLastPoint, radius)) {
                this._points[0] = otherLastPoint;
                updatedFirstPoint = true;
            }

            if(!updatedLastPoint && myLastPoint.isWithinRadius(otherFirstPoint, radius)) {
                this._points[this._points.length] = otherFirstPoint;
                updatedLastPoint = true;
            }

            if(!updatedLastPoint && myLastPoint.isWithinRadius(otherLastPoint, radius)) {
                this._points[this._points.length] = otherLastPoint;
                updatedLastPoint = true;
            }

        });

        if (updatedFirstPoint || updatedLastPoint) {
            this._updatePath2D();
        }
    };

    getLengthInPixels = (): number => {
        if (!this._fittedSegment) {
            throw new Error();
        }
        return this._fittedSegment.getLength();
    };

    getStartDirection = (): number => {
        if (!this._fittedSegment) {
            throw new Error();
        }
        return this._fittedSegment.getStartDirection();
    };

    getReverseStartDirection = (): number => {
        if (!this._fittedSegment) {
            throw new Error();
        }
        return this._fittedSegment.getReverseStartDirection();
    };

    abstract setFittedSegment(): void;
    protected abstract _updatePath2D(): void;
}
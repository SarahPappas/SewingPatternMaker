import { Point } from './Point';
import { PatternPathType, ToolType } from './Enums';
import { CurveFitter } from './CurveFitter';
import { Curve } from './Curve';

export class PatternPath implements IPatternPath {
    private _points: Point[];
    private _type: PatternPathType;
    private _toolType: ToolType;
    private _path2D: Path2D;
    private _isPath2DValid: boolean;
    private _lastIndexAddedToPath2D: number;
    private _isSelected: boolean;
    private _isHighlighted: boolean;
    private _fittedCurve: Curve | null;

    constructor (pathType: PatternPathType, toolType: ToolType) {
        this._type = pathType;
        this._toolType = toolType;
        this._points = new Array<Point>();
        this._path2D = new Path2D();
        this._isPath2DValid = false;
        this._lastIndexAddedToPath2D = -1;
        this._isSelected = false;
        this._isHighlighted = false;
        this._fittedCurve = null;
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
        switch(this._toolType) {
            case ToolType.StraightLine:
                this._updatePath2DStraightLine();
                break;
            case ToolType.Freeline:
                this._updatePath2DWithQuadraticCurve();
                break;
        }

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

    fitCurve = (): void => {
        const firstPoint = this._points[0];
        this._path2D = new Path2D();
        this._isPath2DValid = true;
        this._path2D.moveTo(firstPoint.getX(), firstPoint.getY());

        this._fittedCurve = CurveFitter.Fit(this._points);
        this._path2D.quadraticCurveTo(this._fittedCurve.control.getX(), this._fittedCurve.control.getY(), this._fittedCurve.end.getX(), this._fittedCurve.end.getY());        
    }

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
            if (this._toolType === ToolType.StraightLine) {
                this._updatePath2DStraightLine();
            }

            if (this._toolType === ToolType.Freeline) {
                this._updatePath2DWithQuadraticCurve();
            }
        }
    }

    public select = (): void => {
        this._isSelected = true;
    }

    public deselect = (): void => {
        this._isSelected = false;
    }

    public isSelected = (): boolean => {
        return this._isSelected;
    }

    public highlight = (): void => {
        this._isHighlighted = true;
    }

    public removeHighlight = (): void => {
        this._isHighlighted = false;
    }

    public isHighlighted = (): boolean => {
        return this._isHighlighted;
    }

    public getLengthInPixels = (): number => {
        switch(this._toolType) {
            case ToolType.StraightLine:
                return Math.sqrt(this._points[0].distanceSquared(this._points[this._points.length - 1]));
            case ToolType.Freeline:
                // TODO: implement this method for arcs    
                if (this._fittedCurve === null) {
                    throw new Error();
                }
                return this._fittedCurve.getLength();
        }
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

        const midPoint = prevPoint.computeMiddlePoint(currPoint);
        this._path2D.quadraticCurveTo(prevPoint.getX(), prevPoint.getY(), midPoint.getX(), midPoint.getY());
    }

    private _updatePath2DStraightLine = (): void => {
        const firstPoint = this._points[0];
        const lastPoint = this._points[this._points.length -1];
        
        this._path2D = new Path2D();
        this._isPath2DValid = true;
        this._path2D.moveTo(firstPoint.getX(), firstPoint.getY());
        this._path2D.lineTo(lastPoint.getX(), lastPoint.getY());
    }
}
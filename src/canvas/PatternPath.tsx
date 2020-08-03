import { Point } from './Point';
import { PatternPathType, ToolType } from './Enums';

export class PatternPath implements IPatternPath {
    private _points: Point[];
    private _smoothPoints: Point[];
    private _type: PatternPathType;
    private _toolType: ToolType;
    private _path2D: Path2D;
    private _isPath2DValid: boolean;
    private _lastIndexAddedToPath2D: number;

    constructor (pathType: PatternPathType, toolType: ToolType) {
        this._type = pathType;
        this._toolType = toolType;
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

    private _computeMiddlePoint = (point1: Point, point2: Point): Point => {
        const middleX = (point1.getX() + point2.getX()) / 2;
        const middleY = (point1.getY() + point2.getY()) / 2;
        
        return new Point(middleX, middleY);
    }
    
    /*
    * Replaces the path2D of the patternPath with a smoothed path. The path is smoothed
    * all at once, replacing the old path. The method is to be called after the drawing
    * is completed, for example on the onMouseUp event. The path is smoothed by selecting
    * a subset of the points array. The points are selected by the selectPoints method.
    */
    public smoothCurvyPath = (): void => {
        this._smoothPoints = this._selectPointsForSmoothing();
        // Do not smooth lines that have less than 3 reference points
        if (this._smoothPoints.length > 2) {
            this._path2D = new Path2D();
            this._isPath2DValid = true;
            this._path2D.moveTo(this._smoothPoints[0].getX(), this._smoothPoints[0].getY());
            let i: number;
            for (i = 1;i < this._smoothPoints.length - 2;i++) {
                const midPoint = this._computeMiddlePoint(this._smoothPoints[i], this._smoothPoints[i+1]);
                this._path2D.quadraticCurveTo(this._smoothPoints[i].getX(), this._smoothPoints[i].getY(), midPoint.getX(), midPoint.getY());
            }
            this._path2D.quadraticCurveTo(this._smoothPoints[i].getX(), this._smoothPoints[i].getY(), this._smoothPoints[i+1].getX(), this._smoothPoints[i+1].getY());
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

        const midPoint = this._computeMiddlePoint(prevPoint, currPoint);
        this._path2D.quadraticCurveTo(prevPoint.getX(), prevPoint.getY(), midPoint.getX(), midPoint.getY());
    }

    private _squaredDistance = (point1: Point, point2: Point): number => {
        const dx = point2.getX() - point1.getX();
        const dy = point2.getY() - point1.getY();
        return dx*dx + dy*dy;
    }

    /*
    * Returns a selection of points from the _points array that sum up the points.
    * The points that are too close in distance from each other are discarded, but
    * that rule can be overriden in order to not skip more data points than 
    * MAX_SKIPPED_POINTS.
    */
    private _selectPointsForSmoothing = (): Point[] => {      
        const MIN_SQUARED_DISTANCE_BETWEEN_POINTS = 64;
        const MAX_SKIPPED_POINTS = 39;
        const result = new Array<Point>();
        if (this._points.length > 2) {
            // Always include the first point
            result.push(this._points[0]);
            let lastIndexTaken = 0;
            for(let i = 0;i < this._points.length - 1;i++) {
                // Discard points that are too close in index or in distance to the last added point
                if (i - lastIndexTaken > MAX_SKIPPED_POINTS || 
                        this._squaredDistance(this._points[i], this._points[lastIndexTaken]) 
                        > MIN_SQUARED_DISTANCE_BETWEEN_POINTS) {
                    result.push(this._points[i]);
                    lastIndexTaken = i;
                }
            }
            // Always include the last point
            result.push(this._points[this._points.length - 1]);
        }
        return result;
    }

    snapEndpoints = (paths: PatternPath[]): void => {
        const endpoints: {start: Point; end: Point}[] = [];
        paths.forEach(path => {
            if (path === this) {
                return;
            }
            const points = path.getPoints();
            endpoints.push({start: points[0], end: points[points.length - 1]});
        });

        const myStartPoint = this._points[0];
        const myEndPoint = this._points[this._points.length - 1];
        // Radius to check within to see if we should snap to point.
        const radius = 10;
        let updatedStartPoint = false;
        let updatedEndPoint = false;
        endpoints.forEach(point =>  {
            if(!updatedStartPoint && myStartPoint.isWithinRadius(point.start, radius)) {
                this._points[0] = point.start;
                updatedStartPoint = true;
            }

            if(!updatedStartPoint && myStartPoint.isWithinRadius(point.end, radius)) {
                this._points[0] = point.end;
                updatedStartPoint = true;
            }

            if(!updatedEndPoint && myEndPoint.isWithinRadius(point.start, radius)) {
                this._points[this._points.length] = point.start;
                updatedEndPoint = true;
            }

            if(!updatedEndPoint && myEndPoint.isWithinRadius(point.end, radius)) {
                this._points[this._points.length] = point.end;
                updatedEndPoint = true;
            }
        });

        if (updatedStartPoint || updatedEndPoint) {
            if (this._toolType == ToolType.StraightLine) {
                this._updatePath2DStraightLine();
            }

            if (this._toolType == ToolType.Freeline) {
                this._updatePath2DWithQuadraticCurve();
            }
        }
    }

    private _updatePath2DStraightLine = (): void => {
        const firstPoint = this._points[0];
        const lastPoint = this._points[this._points.length -1];
        
        this._path2D = new Path2D();
        this._path2D.moveTo(firstPoint.getX(), firstPoint.getY());
        this._path2D.lineTo(lastPoint.getX(), lastPoint.getY());
    }
}
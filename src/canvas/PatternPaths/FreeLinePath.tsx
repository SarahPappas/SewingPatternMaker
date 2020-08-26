import { PatternPath } from "./PatternPath";
import { CurveFitter } from '../Geometry/CurveFitter';
import { Point } from '../Geometry/Point';

export class FreeLinePath extends PatternPath {    
    protected _setFittedSegment = (): void => {
        this._path2D = new Path2D();
        this._isPath2DValid = true;
        this._fittedSegment = CurveFitter.Fit(this._points);
        this._fittedSegment.draw(this._path2D);
    };
    
    protected _addPoint = (point: Point): void => {
        this._points.push(point);
    };

    /* 
    * The algorithm for starting and ending the line is not quite right. The first segment of the path will be 
    * a straight line because a bezier curve with a control point equal to one of is extremities points will 
    * just be a line. Additionally, The line will not end on the exact last point. Instead, it will end on the 
    * middle of the last two points. We decided this is okay for now, but may need to be updated in the future.
    */
    protected _updatePath2D = (): void => {
        const currPoint = this._points[this._points.length - 1];
        const prevPoint = this._points[this._lastIndexAddedToPath2D];

        const midPoint = Point.computeMiddlePoint(prevPoint, currPoint);
        this._path2D.quadraticCurveTo(prevPoint.x, prevPoint.y, midPoint.x, midPoint.y);
    };
}
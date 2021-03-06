import { TracingPath } from './TracingPath';
import { Point } from '../Geometry/Point';

export class FreeLinePath extends TracingPath { 
    protected _addPoint = (point: Point): void => {
        if (!this._points[this._points.length - 1].equals(point)) {
            this._points.push(point);
        }
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
import { PatternPath } from './PatternPath';
import { LineSegment } from 'canvas/Geometry/LineSegment';
import { Point } from 'canvas/Geometry/Point';
import { Segment } from 'canvas/Geometry/Segment';

export class StraightLinePath extends PatternPath {
    protected _createPathsFromSegments = (segments: Segment[]): PatternPath[] => {
        const paths: StraightLinePath[] = [];
        segments.forEach(segment => {
            paths.push(new StraightLinePath(this._type, segment));
        });

        return paths;
    };

    protected _setFittedSegment = (): void => {
        this._fittedSegment = new LineSegment(this._points[0], this._points[this._points.length - 1]);
    };

    protected _addPoint = (point: Point): void => {
        this._points[1] = point;
    };


    protected _updatePath2D = (): void => {
        const firstPoint = this._points[0];
        const lastPoint = this._points[this._points.length - 1];
        
        this._path2D = new Path2D();
        this._isPath2DValid = true;
        this._path2D.moveTo(firstPoint.x, firstPoint.y);
        this._path2D.lineTo(lastPoint.x, lastPoint.y);
    };
}

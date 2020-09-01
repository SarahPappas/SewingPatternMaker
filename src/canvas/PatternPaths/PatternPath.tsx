import { Point } from '../Geometry/Point';
import { PatternPathType } from '../Enums';
import { Segment } from 'canvas/Geometry/Segment';

export class PatternPath {
    protected _type: PatternPathType;
    protected _path2D: Path2D;
    protected _segment: Segment;
    protected _points: Point[];

    constructor (pathType: PatternPathType, segment: Segment) {
        this._type = pathType;
        this._segment = segment;

        this._points = segment.computePoints();
        if (!this._points[0].equals(segment.getStart())) {
            this._points.unshift(segment.getStart());
        }
        if (!this._points[this._points.length - 1].equals(segment.getEnd())) {
            this._points.push(segment.getEnd());
        }

        this._path2D = new Path2D();
        this._updatePath2D();
    }

    getPoints = (): Point[] => {
        return this._points;
    };

    getType = (): PatternPathType => {
        return this._type;
    };

    getPath2D = (): Path2D => {
        return this._path2D;
    };

    getLengthInPixels = (): number => {
        return this._segment.getLength();
    };

    getSegment = (): Segment => {
        return this._segment;
    };

    splitAtPoint = (intersection: Point): PatternPath[] => {
        const originalSegment = this.getSegment();
        const splitSegments = originalSegment.split(intersection);
        if (splitSegments.length !== 2) {
            throw new Error("Split did not return correct number of segments");
        }

        return this._createPathsFromSegments(splitSegments);
    };

    protected _createPathsFromSegments = (segments: Segment[]): PatternPath[] => {
        const paths: PatternPath[] = [];
        segments.forEach(segment => {
            paths.push(new PatternPath(this._type, segment));
        });

        return paths;
    };   
    
    protected _updatePath2D = (): void => {
        this._path2D = new Path2D();
        const start = this._segment.getStart();
        this._path2D.moveTo(start.x, start.y);
        this._segment.drawTo(this._path2D);
    };
}
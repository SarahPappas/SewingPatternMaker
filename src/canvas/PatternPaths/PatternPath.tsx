import { Point } from '../Geometry/Point';
import { PatternPathType } from '../Enums';
import { Segment } from 'canvas/Geometry/Segment';
import { Vector } from 'canvas/Geometry/Vector';
import { LineSegment } from 'canvas/Geometry/LineSegment';
import { App } from 'canvas/AppController';

export class PatternPath implements IPatternPath {
    protected _type: PatternPathType;
    protected _path2D: Path2D;
    protected _segments: Segment[];
    protected _points: Point[];

    constructor (pathType: PatternPathType, segments: Segment[]) {
        this._type = pathType;
        this._segments = segments;
        this._points = this._computePoints();
        this._path2D = this._computePath2D();
    }

    getPoints = (): Point[] => {
        return this._points;
    };

    // Returns a clone of the start point of the path for protection
    getStart = (): Point => {
        return this._segments[0].getStart().clone();
    };

    // Returns a clone of the end point of the path for protection
    getEnd = (): Point => {
        return this._segments[this._segments.length - 1].getEnd().clone();
    };

    getTangentAtStart = (): Vector => {
        return this._segments[0].getTangent(0);
    };

    getTangentAtEnd = (): Vector => {
        return this._segments[this._segments.length - 1].getTangent(1);
    };

    getType = (): PatternPathType => {
        return this._type;
    };

    getPath2D = (): Path2D => {
        return this._path2D;
    };

    getLengthInPixels = (): number => {
        return this._segments.reduce((runningTotal, segment) => {
            return runningTotal + segment.getLength();
        }, 0);
    };

    getSegments = (): Segment[] => {
        return this._segments;
    };

    splitAtPoint = (intersection: Point, segmentIndex: number): PatternPath[] => {
        const segmentToSplit = this._segments[segmentIndex];
        const splitSegments = segmentToSplit.split(intersection);
        if (splitSegments.length !== 2) {
            throw new Error("Split did not return correct number of segments");
        }

        const segmentsOfFirstPath = [];
        for (let i = 0; i < segmentIndex; i++) {
            segmentsOfFirstPath.push(this._segments[i]);
        }
        segmentsOfFirstPath.push(splitSegments[0]);

        const segmentsOfSecondPath = [splitSegments[1]];
        for (let i = segmentIndex + 1; i < this._segments.length; i++) {
            segmentsOfSecondPath.push(this._segments[i]);
        }
        
        return [new PatternPath(this._type, segmentsOfFirstPath), 
                new PatternPath(this._type, segmentsOfSecondPath)];
    };

    getAllowance = (): PatternPath => {
        // Get the path that is offset from this one
        const offsetSegments = this._getOffsetSegments();
        const lengthOfLineProlongations = 100;

        // Add a line segment at the beginning of the offset path,
        // following the tangent of the offset at that point  
        const firstSegment = offsetSegments[0];      
        const p1 = firstSegment.getStart();
        const p2 = Point.translate(p1, firstSegment.getTangent(0).normalize().multiplyByScalar(-1 * lengthOfLineProlongations));
        
        // Add a line segment at the end of the offset path,
        // following the tangent of the offset at that point
        const lastSegment = offsetSegments[offsetSegments.length - 1];
        const q1 = lastSegment.getEnd();
        const q2 = Point.translate(q1, lastSegment.getTangent(1).normalize().multiplyByScalar(lengthOfLineProlongations));
        
        let result: Segment[] = [new LineSegment(p2, p1)];
        result = result.concat(offsetSegments);
        result.push(new LineSegment(q1, q2));
        return new PatternPath(this._type, result);
    };

    translate = (displacement: Vector): void => {
        this._segments.forEach(segment => {
            segment.translate(displacement);
        });
        this._path2D = this._computePath2D();
    };

    clone = (): PatternPath => {
        const segments: Segment[] = [];
        for (let i = 0; i < this._segments.length; i++) {
            segments.push(this._segments[i].clone());
        }
        return new PatternPath(this._type, segments);
    };

    reversedClone = (): PatternPath => {
        const reversedSegments: Segment[] = [];
        for (let i = this._segments.length - 1; i >= 0; i--) {
            reversedSegments.push(this._segments[i].reversedClone());
        }
        return new PatternPath(this._type, reversedSegments);
    }

    private _getOffsetSegments = (): Segment[] => {
        // Set the allowance size according to the type of pattern path
        const allowanceSize = App.document.getAllowanceSize(this._type);
        if (allowanceSize === undefined) {
            throw new Error("an allowance size was not defined for this type of path");
        }

        // Find the array of segments that form the offset of the current
        // path. 
        let offsetSegments: Segment[] = [];
        this._segments.forEach(segment => {
            offsetSegments = offsetSegments.concat(segment.getOffsetSegments(allowanceSize));
        });

        return offsetSegments;
    };

    private _computePoints = (): Point[] => {
        let points: Point[] = [];
        this._segments.forEach(segment => {
            points = points.concat(segment.getPoints());
        });
        return points;
    };

    private _computePath2D = (): Path2D => {
        const path2D = new Path2D();
        const start = this.getStart();
        path2D.moveTo(start.x, start.y);
        this._segments.forEach(segment => {
            segment.drawTo(path2D);
        });
        return path2D; 
    };
}
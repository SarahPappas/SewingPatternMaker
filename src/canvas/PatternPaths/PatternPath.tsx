import { Point } from '../Geometry/Point';
import { PatternPathType } from '../Enums';
import { Segment } from 'canvas/Geometry/Segment';
import { Vector } from 'canvas/Geometry/Vector';

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

    /**
     * Returns an array of 2 new PatternPaths, one of the path from start to 
     * the inputted point, the second from the inputted point to the end.
     * 
     * Precondition: the input point is on the path
     * 
     * @param point the point on the path where we split the path
     * @param segmentIndex the index of the path's segment that contains the point
     */
    splitAtPoint = (point: Point, segmentIndex: number): PatternPath[] => {
        const splitSegments = this._splitSegments(point, segmentIndex);
        return [new PatternPath(this._type, splitSegments[0]),
                new PatternPath(this._type, splitSegments[1])];
    };

    /**
     * Shortens the current path by removing the part that is before or after the inputted point. 
     * If trimBeforePoint is true, will remove the part of the path that is 
     * before the point. Otherwise it will remove the part of the path that is after the point.
     * 
     * Precondition: the input point is on the path
     * 
     * @param point the point on the path where we split the path
     * @param segmentIndex the index of the path's segment that contains the point
     */
    trimAtPoint = (point: Point, segmentIndex: number, trimBeforePoint: boolean): void => {
        let index;
        if (trimBeforePoint) {
            index = 1;
        } else {
            index = 0;
        }

        this._segments = this._splitSegments(point, segmentIndex)[index];
        // Update data fields
        this._points = this._computePoints();
        this._path2D = this._computePath2D();
    };

    addSegment = (newSegment: Segment): void => {
        this._segments.push(newSegment);
        this._points = this._computePoints();
        this._path2D = this._computePath2D();
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
    };

    equals = (other: PatternPath): boolean => {
        if (this === other) {
            return true;
        }
        
        if (this._type !== other._type) {
            return false;
        }

        if (this._segments.length !== other._segments.length) {
            return false;
        }

        for (let i = 0; i < this._segments.length; i++) {
            if (!this._segments[i].equals(other._segments[i])) {
                return false;
            }
        }
        return true;        
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

    private _splitSegments = (point: Point, segmentIndex: number): Segment[][] => {
        const segmentToSplit = this._segments[segmentIndex];
        const splitSegments = segmentToSplit.split(point);
        if (splitSegments.length !== 2) {
            throw new Error("Split did not return correct number of segments");
        }
        
        const segmentsBeforePoint = [];
        for (let i = 0; i < segmentIndex; i++) {
            segmentsBeforePoint.push(this._segments[i]);
        }
        segmentsBeforePoint.push(splitSegments[0]);

        const segmentsAfterPoint = [splitSegments[1]];
        for (let i = segmentIndex + 1; i < this._segments.length; i++) {
            segmentsAfterPoint.push(this._segments[i]);
        }
        
        return [segmentsBeforePoint, segmentsAfterPoint];
    };
}
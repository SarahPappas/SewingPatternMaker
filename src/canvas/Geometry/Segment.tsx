import { Point } from './Point';
import { Vector } from './Vector';

export abstract class Segment {
    protected start: Point;
    protected end: Point;

    constructor(start: Point, end: Point) {
        if (start.equals(end)) {
            throw new Error("starting point of Segment must be different from end point");
        }
        this.start = start;
        this.end = end;
    }

    getStart = (): Point => {
        return this.start;
    };

    getEnd = (): Point => {
        return this.end;
    };

    abstract getLength(): number;
    
    abstract getTangent(t: number): Vector;

    abstract computePoints(numOfPoints?: number): Point[];

    abstract split(point: Point): Segment[];

    /* Returns null if the point is not within the threshold of the segment.
     *  Otherwise, it returns the point on the semgent closest to the point provided. */
    abstract isPointNearSegment (point: Point, threshold: number): Point | null;

    abstract drawTo(path: Path2D): void;
}
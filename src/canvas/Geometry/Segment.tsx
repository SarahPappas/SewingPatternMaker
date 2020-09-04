import { Point } from './Point';
import { Vector } from './Vector';

export abstract class Segment {
    protected points: Point[] | null;
    protected start: Point;
    protected end: Point;

    constructor(start: Point, end: Point) {
        if (start.equals(end)) {
            throw new Error("starting point of Segment must be different from end point");
        }
        this.start = start.clone();
        this.end = end.clone();
        this.points = null;
    }

    getStart = (): Point => {
        return this.start;
    };

    getEnd = (): Point => {
        return this.end;
    };

    abstract getLength(): number;
    
    /**
     * Returns a vector that is tangent to the curve at the position indicated by
     * the parameter t.
     * 
     * @param t Describes the position on the curve where we want the tangent vector.
     *          t should be between 0 and 1 inclusively, 0 for the start of the curve,
     *          1 for the end
     */
    abstract getTangent(t: number): Vector;

    /**
     * Returns an array of numOfPoints pts (defaults to 100) on the 
     * segment if it's aCurve, 2 points if it's a LineSegment. If 
     * called repeatedly, will recompute the points every time.
     * Does not expose this segment's endpoints data fields 
     * (clones are made where necessary).
     * 
     * @param numOfPoints number of points in the returned array. Optional.
     */
    abstract computePoints(numOfPoints?: number): Point[];

    /**
     * Returns an array of 100 pts on the segment if it's a Curve, 
     * 2 points if it's a LineSegment. If called repeatedly, will 
     * not re-compute the points. Does not expose this segment's 
     * endpoints data fields (clones are made where necessary).
     */
    getPoints = (): Point[] => {
        if (!this.points){
            this.points = this.computePoints();
        }
        return this.points;
    };

    abstract split(point: Point): Segment[];

    /* Returns null if the point is not within the threshold of the segment.
     *  Otherwise, it returns the point on the semgent closest to the point provided. */
    abstract isPointNearSegment (point: Point, threshold: number): Point | null;

    abstract drawTo(path: Path2D): void;

    abstract getOffsetSegments(distance: number): Segment[];

    abstract translate(displacement: Vector): void;

    abstract clone(): Segment;
    abstract reversedClone(): Segment;
}
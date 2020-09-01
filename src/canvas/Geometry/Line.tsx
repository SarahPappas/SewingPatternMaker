import { Segment } from './Segment';
import { Vector } from './Vector';
import { Point } from './Point';

export class Line extends Segment {
    getLength = (): number => {
        return this.start.distanceTo(this.end);
    };

    getTangent = (t: number): Vector => {
        if (t < 0 || t > 1) {
            throw new Error();
        }
        return Vector.vectorBetweenPoints(this.start, this.end);
    };

    // Precondition: point must be on the line. 
    split = (point: Point): Line[] => {
        const lines = [];
        lines.push(new Line(this.start, point));
        lines.push(new Line(point, this.end));
        return lines;

    };

    computePoints = (): Point[] => {
        const points = [];
        points.push(this.getStart());
        points.push(this.getEnd());
        return points;
    };

    /**
     * Returns null if the projection of the point on the line supporting the 
     * segment is not on the segment itself or if the distance between the point
     * and the segment is not within the threshold.
     * Otherwise, it returns the point on the segment closest to the point provided.
     * 
     * @param point 
     * @param threshold 
     */
    isPointNearSegment = (point: Point, threshold: number): Point | null => {
        if (this.start.equals(point)) {
            return point;
        }

        if (this.end.equals(point)) {
            return point;
        }

        const startToPoint = Vector.vectorBetweenPoints(this.start, point);
        const startToEnd = Vector.vectorBetweenPoints(this.start, this.end);
        const angle =  Vector.changeInAngle(startToPoint, startToEnd);

        const h = startToPoint.norm();
        const a = h * Math.cos(angle);
        const d = this.getLength();
        const t = a / d;

        // If t is greater than 1 or less than 0, the closest intersection to the line will be off the line segment.
        if (t > 1 || t < 0) {
            return null;
        }

        // Compare the distance between the point given to the closest point on the line and the threshold.
        const iPoint = Point.translate(this.start, startToEnd.multiplyByScalar(t));
        const pointToLine = point.distanceTo(iPoint);
        if (pointToLine >= threshold) {
            return null;
        }
        
        return iPoint;
    };

    protected _drawTo = (path: Path2D): void => {
        path.lineTo(this.end.x, this.end.y);
    };

    /**
     * Finds an intersection point of two lines. If withinSegment in false, it 
     * will return the intersection point between the lines that support 
     * the two inputted lines regardless of where that point is, and return null
     * if the lines are parallel.
     * If withinSegment is true, it will only return the point of intersection
     * if that point belongs to both of the inputted segments, and null
     * otherwise or if the lines are parallel.
     * 
     * Uses an algorithm described in https://en.wikipedia.org/wiki/Line–line_intersection 
     * TODO: If a line is ontop of another line, we will not return an intersection. We need to decide how to handle this case.
     * Ideally, a path directly ontop of another path should be ignored.
     * TODO: Implement optimization to make intersection check quicker. We discussed possibly using this algorithm:
     * https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
     * 
     * @param thisL the first line segment
     * @param thatL the second line segment
     * @param withinSegment indicates whether the intersection has to be found 
     *                      within the inputted segments
     * @param threshold ??
     */ 
    static findIntersectionPointOfTwoLines = (thisL: Line, thatL: Line, withinSegment: boolean, threshold?: number): Point | null => { 
        threshold = threshold || 0;

        const x1 = thisL.getStart().x;
        const x2 = thisL.getEnd().x;
        const x3 = thatL.getStart().x;
        const x4 = thatL.getEnd().x;

        const y1 = thisL.getStart().y;
        const y2 = thisL.getEnd().y;
        const y3 = thatL.getStart().y;
        const y4 = thatL.getEnd().y;

        const determinant = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4); 
      
        if (determinant === 0) 
        { 
            // The lines are parallel, so return null.
            return null; 
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / determinant;

        if (withinSegment && (t < -1 * threshold || t > 1 + threshold)) {
            return null;
        }

        const u =  -1 * ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / determinant;

        if (withinSegment && (u < -1 * threshold || u > 1 + threshold)) {
            return null;
        }

        const xIntersectionPoint = x1 + t * (x2 - x1);
        const yIntersectionPoint = y1 + t * (y2 - y1);
        
        return new Point(xIntersectionPoint, yIntersectionPoint);
    };
}
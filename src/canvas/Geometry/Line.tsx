import { Segment } from './Segment';
import { Vector } from './Vector';
import { Point } from './Point';

export class Line extends Segment {
    getLength = (): number => {
        return Math.sqrt(this.start.distanceSquared(this.end));
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

    /* Checks if a point is on a line segement. */
    isPointOnLineSegment = (point: Point, threshold: number): boolean => {
        const startToPoint = Vector.vectorBetweenPoints(this.getStart(), point);
        const startToEnd = Vector.vectorBetweenPoints(this.getStart(), this.getEnd());

        const cross = Vector.normOfCrossProduct(startToPoint, startToEnd);
        
        if(cross > threshold) {
            return false;
        }
        
        const dxl = this.getEnd().x - this.getStart().x;
        const dyl = this.getEnd().y - this.getStart().y;

        // Now we know that the point does lie on the line, it is time to check whether it lies between the original points. 
        // This can be easily done by comparing the x coordinates, if the line is "more horizontal than vertical", or y coordinates otherwise.
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return this.getStart().x <= this.getEnd().x ? 
                this.getStart().x <= point.x && point.x <= this.getEnd().x :
                this.getEnd().x <= point.x && point.x <= this.getStart().x;
        } else {
            return this.getStart().y <= this.getEnd().y ? 
                this.getStart().y <= point.y && point.y <= this.getEnd().y :
                this.getEnd().y <= point.y && point.y <= this.getStart().y;
        }
    };

    /* Checks if point is near a line segment. If the point is on an endpoint it returns null */
    isPointNearSegment = (point: Point, threshold: number): Point | null => {
        if (this.start.equals(point)) {
            return point;
        }

        if (this.end.equals(point)) {
            return point;
        }


        const startToPoint = new Line(this.start, point);
        const startToEnd = new Line(this.start, this.end);
        let angle = Line.findAngleBetweenLineSegments(startToPoint, startToEnd);
        /* 
         * Depending on which point is the start point and which is the end point, our angle could 
         * be the larger or smaller angle. We always want to use the smaller angle.
        */
        if (angle > 90) {
            angle = 180 - angle;
        }

        const h = startToPoint.getLength();
        const a = h * Math.cos(angle);
        const d = this.getLength();
        const t = a / d;

        // If t is greater than 1 or less than 0, the closest intersection to the line will be off the line segment.
        if (t > 1 || t < 0) {
            return null;
        }

        // The intersection point = startPoint * (1 - t) + endpoint * t
        // Compare the distance between the point given to the closest point on the line and the threshold.
        const iPoint = Point.AddPoints(this.start.multiplyByScalar(1 - t), this.end.multiplyByScalar(t));
        const pointToLine = new Line(point, iPoint).getLength();
        if (pointToLine > threshold) {
            return null;
        }
        
        return iPoint;
    };

    protected _drawTo = (path: Path2D): void => {
        path.lineTo(this.end.x, this.end.y);
    };

    static findAngleBetweenLineSegments = (a: Line, b: Line): number => {
        const va = Vector.vectorBetweenPoints(a.start, a.end);
        const vb = Vector.vectorBetweenPoints(b.start, b.end);
        return Vector.changeInAngle(va, vb);
    }

}
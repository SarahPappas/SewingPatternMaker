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
    }

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

    protected _drawTo = (path: Path2D): void => {
        path.lineTo(this.end.x, this.end.y);
    };

}
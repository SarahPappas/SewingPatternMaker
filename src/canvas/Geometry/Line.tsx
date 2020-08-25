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

    protected _drawTo = (path: Path2D): void => {
        path.lineTo(this.end.x, this.end.y);
    };
}
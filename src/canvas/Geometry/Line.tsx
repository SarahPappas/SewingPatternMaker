import { Segment } from "./Segment";
import { Vector } from "./Vector";
import { Point } from "./Point";

export class Line extends Segment {
    getLength = (): number => {
        return Math.sqrt(this.start.distanceSquared(this.end));
    };

    getTangent = (t: number): Vector => {
        if (t < 0 || t > 1) {
            throw new Error();
        }
        return Vector.vectorBetweenPoints(this.start, this.end);
    }

    protected _drawTo = (path: Path2D): void => {
        path.lineTo(this.end.x, this.end.y);
    };

    translate = (displacement: Vector): void => {
        this.start = Point.translate(this.start, displacement);
        this.end = Point.translate(this.end, displacement);
    };
}
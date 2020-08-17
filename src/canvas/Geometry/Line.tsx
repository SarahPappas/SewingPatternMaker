import { Segment } from "./Segment";
import { Vector } from "./Vector";

export class Line extends Segment {
    getStartDirection = (): number => {
        const startVector = Vector.vectorBetweenPoints(this.start, this.end);
        return startVector.getAngle();
    };

    getReverseStartDirection = (): number => {
        const reverseStartVector = Vector.vectorBetweenPoints(this.end, this.start);
        return reverseStartVector.getAngle();
    };

    getLength = (): number => {
        return Math.sqrt(this.start.distanceSquared(this.end));
    };

    protected _drawTo = (path: Path2D): void => {
        path.lineTo(this.end.x, this.end.y);
    };
}
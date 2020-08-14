import { Segment } from "./Segment";

export class Line extends Segment {
    getLength = (): number => {
        return Math.sqrt(this.start.distanceSquared(this.end));
    };

    protected _drawTo = (path: Path2D): void => {
        path.lineTo(this.end.x, this.end.y);
    };
}
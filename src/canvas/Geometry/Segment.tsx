import { Point } from "./Point";

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

    abstract getLength(): number;
    
    draw = (path: Path2D): void => {
        path.moveTo(this.start.x, this.start.y);
        this._drawTo(path);
    };

    protected abstract _drawTo(path: Path2D): void;
}
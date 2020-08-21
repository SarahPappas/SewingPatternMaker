import { Point } from "./Point";
import { Vector } from "./Vector";

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

    draw = (path: Path2D): void => {
        path.moveTo(this.start.x, this.start.y);
        this._drawTo(path);
    };

    protected abstract _drawTo(path: Path2D): void;
}
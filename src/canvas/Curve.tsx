import { Point } from './Point';

export class Curve {
    start: Point;
    end: Point;
    control: Point;

    constructor (start: Point, end: Point, control: Point) {
        this.start = start;
        this.end = end;
        this.control = control;
    }

    computePointsOnCurve = (numPoints: number): Point[] => {
        const resultingPoints = new Array<Point>();
        for (let i = 0; i < numPoints; i++) {
            const t = i / (numPoints - 1);
            resultingPoints[i] = this.computePoint(t);
        }
        return resultingPoints;
    };

    getLength = (): number => {
        return -1;
    }

    private computePoint = (t: number): Point => {
        const startToControlX = this.lerp(this.start.getX(), this.control.getX(), t);
        const startToControlY = this.lerp(this.start.getY(), this.control.getY(), t);

        const controlToEndX = this.lerp(this.control.getX(), this.end.getX(), t);
        const controlToEndY = this.lerp(this.control.getY(), this.end.getY(), t);

        return new Point(this.lerp(startToControlX, controlToEndX, t),
                    this.lerp(startToControlY, controlToEndY, t));
    };

    private lerp = (start: number, end: number, t: number): number => {
        return start + t * (end - start);
    };
}
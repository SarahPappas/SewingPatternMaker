import { Point } from "./Point";
import { Curve } from "./Curve";

export class BezierCurve extends Curve {
    // using De Casteljau's algorithm (slower but more stable than the direct approach)
    computePoint = (t: number): Point => {
        const startToControlX = this.lerp(this.start.getX(), this.control.getX(), t);
        const startToControlY = this.lerp(this.start.getY(), this.control.getY(), t);

        const controlToEndX = this.lerp(this.control.getX(), this.end.getX(), t);
        const controlToEndY = this.lerp(this.control.getY(), this.end.getY(), t);

        return new Point(this.lerp(startToControlX, controlToEndX, t),
                    this.lerp(startToControlY, controlToEndY, t));
    };
}

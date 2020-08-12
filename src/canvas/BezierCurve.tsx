import { Point } from "./Point";
import { Curve } from "./Curve";

export class BezierCurve extends Curve {
    // using De Casteljau's algorithm (slower but more stable than the direct approach)
    // override abstract method in parent
    protected computePoint = (t: number): Point => {
        const startToControlX = this.lerp(this.start.x, this.control.x, t);
        const startToControlY = this.lerp(this.start.y, this.control.y, t);

        const controlToEndX = this.lerp(this.control.x, this.end.x, t);
        const controlToEndY = this.lerp(this.control.y, this.end.y, t);

        return new Point(this.lerp(startToControlX, controlToEndX, t),
                    this.lerp(startToControlY, controlToEndY, t));
    };

    // override abstract method in parent
    drawCurve = (path: Path2D): void => {
        path.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y);   
    }
}

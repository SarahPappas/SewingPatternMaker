import { Curve } from "./Curve";
import { Point } from "./Point";

export class ArcCurve extends Curve {
    //constructor

    computePoint = (t: number): Point => {
        const radius = this.start.getRadius(this.end, this.control);
        const center = this.start.getCenter(this.end, this.control);
        let startAngle = Math.atan2((this.start.getY() - center.getY()), (this.start.getX() - center.getX()));
        let endAngle = Math.atan2((this.end.getY() - center.getY()), (this.end.getX() - center.getX()));

        //make sure we go in the right direction on the circle
        if (Math.abs(endAngle - startAngle) > Math.PI) {
            if (startAngle < endAngle) {
                startAngle += 2 * Math.PI;
            } else {
                endAngle += 2 * Math.PI;
            }
        }
        return new Point(center.getX() + radius * Math.cos(this.lerp(startAngle, endAngle, t)), center.getY() + radius * Math.sin(this.lerp(startAngle, endAngle, t)));
    };
}
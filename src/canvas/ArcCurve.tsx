import { Curve } from "./Curve";
import { Point } from "./Point";
import { Vector } from "./Vector";

export class ArcCurve extends Curve {
    private radius: number;
    private center: Point;
    private startAngle: number;
    private endAngle: number;

    // precondition: start != end and control != middlePoint between start and end
    // precondition: control is equidistant from start and end
    constructor(start: Point, end: Point, control: Point) {
        super(start, end, control);
        if (control.equals(Point.computeMiddlePoint(start, end))) {
            throw new Error("degenerate curve");
        }
        this.center = this._computeCenter();
        this.radius = this.center.distanceTo(start);
        this.startAngle = Vector.vectorBetweenPoints(this.center, start).getAngle();
        this.endAngle = Vector.vectorBetweenPoints(this.center, end).getAngle();
        // Make sure we go in the right direction on the circle: always use the shortest
        // way around the circle
        // todo: comment more
        if (Math.abs(this.endAngle - this.startAngle) > Math.PI) {
            if (this.startAngle < this.endAngle) {
                this.startAngle += 2 * Math.PI;
            } else {
                this.endAngle += 2 * Math.PI;
            }
        }
    }

    private _computeCenter = (): Point => {
        let centerX;
        let centerY;
        
        const startToControl = Vector.vectorBetweenPoints(this.start, this.control);
        const normalVector = Vector.findPerpVector(Vector.vectorBetweenPoints(this.start, this.end));
        
        if (normalVector.x === 0) { // Start and end are horizontally aligned
            // The center is aligned vertically with the control point
            centerX = this.control.x;

            // The center of the circle is such that startToControl vector is
            // perpendicular to startToCenter vector. 
            // equation: startToControl dot startToCenter = 0      
            centerY = this.start.y - 
                        ((startToControl.x * startToControl.x) 
                            / (startToControl.y));
            // In the above, we safely avoid division by zero because of the check in
            // the constructor: 
            // TODO: rewrite this?
        } else {
            // The center of the circle is such that startToControl vector is
            // perpendicular to startToCenter vector.
            // equation 1: startToControl dot startToCenter = 0

            // The center of the circle is on the line that goes through the 
            // control point and that is perpendicular to the vector between start and end.
            // Equation 2: centerY = control + slope * centerX
            const slope = normalVector.y / normalVector.x;
                // In the above, division by zero is avoided because of the if check

            // We insert equation 2 in equation 1, then solve for centerX.
            centerX = (this.start.x * startToControl.x 
                        + (this.control.x * slope - startToControl.y) 
                            * startToControl.y) 
                      / (slope * startToControl.y + startToControl.x);
                      // In the above, having the denominator = 0 would mean that startToControl
                      // is perperdicular to the normal. That cannot happen, because
                      // the control point is never aligned with start and end
                      // per the constructor.
            // Replace centerX in equation 2
            centerY = this.control.y + slope * (centerX - this.control.x);
        }

        return new Point(centerX, centerY);
    };

    // Override abstract method in parent
    protected computePoint = (t: number): Point => {     
        const x = this.center.x + 
                  this.radius * Math.cos(this.lerp(this.startAngle, this.endAngle, t));
        const y = this.center.y + 
                  this.radius * Math.sin(this.lerp(this.startAngle, this.endAngle, t));
        return new Point(x, y);
    };

    // Override abstract method in parent
    drawCurve = (path: Path2D): void => {
        path.arcTo(this.control.x, this.control.y, 
                   this.end.x, this.end.y, 
                   this.radius);
    };

    // Override the approximation algorithm from parent class
    // TODO: TEST THIS
    getLength = (): number => {
        return Math.abs(this.startAngle - this.endAngle) * this.radius;
    };
}
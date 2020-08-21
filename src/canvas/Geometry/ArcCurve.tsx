import { Curve } from "./Curve";
import { Point } from "./Point";
import { Vector } from "./Vector";

export class ArcCurve extends Curve {
    private radius: number;
    private center: Point;
    private startAngle: number;
    private endAngle: number;

    // Precondition: control is equidistant from start and end
    // Precondition: control != middlePoint between start and end
    constructor(start: Point, end: Point, control: Point) {
        super(start, end, control);
        if (control.equals(Point.computeMiddlePoint(start, end))) {
            throw new Error("degenerate curve");
        }
        this.center = this._computeCenter();
        this.radius = this.center.distanceTo(start);
        this.startAngle = Vector.vectorBetweenPoints(this.center, start).getAngle();
        this.endAngle = Vector.vectorBetweenPoints(this.center, end).getAngle();
        // ArcCurves are circle arcs of at most PI degrees. In order
        // for the startAngle and endAngle to reflect that, we 
        // make sure that the difference between those is always 
        // smaller or equal to PI. 
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
        
        if (normalVector.x === 0) { // Happens when start and end are horizontally aligned.
            // The center is aligned vertically with the control point.
            centerX = this.control.x;

            // The center of the circle is such that startToControl vector is
            // perpendicular to startToCenter vector. 
            // Equation: startToControl dot startToCenter = 0
            // Solving for centerY in that equation, and using the previous result, yields:
            centerY = this.start.y - 
                        ((startToControl.x * startToControl.x) 
                            / (startToControl.y));
                    // In the above, division by zero cannot happen: if startToControl.y
                    // was equal to zero, then the control point would be aligned with
                    // the start and end points, meaning that the control point is the 
                    // middle point between start and end. That is a case that is rejected 
                    // by the constructor. 
        } else {
            // The center of the circle is such that startToControl vector is
            // perpendicular to startToCenter vector. This yields:
            // Equation 1: startToControl dot startToCenter = 0

            // The center of the circle is on the line that goes through the 
            // control point and that is perpendicular to the vector between start and end.
            // This yields:
            // Equation 2: centerY = control.y + slope * (centerX - control.x) where:
            const slope = normalVector.y / normalVector.x;
                // In the above, division by zero is avoided because of the if check.

            // We insert equation 2 in equation 1, then solve for centerX:
            centerX = (this.start.x * startToControl.x 
                        + (this.control.x * slope - startToControl.y) 
                            * startToControl.y) 
                      / (slope * startToControl.y + startToControl.x);
                      // In the above, division by zero cannot happen: the denominator 
                      // is equal to the dot product between startToControl and the 
                      // normalVector. If it is zero, it means that startToControl
                      // is perperdicular to the normal. That cannot happen, because
                      // the control point is never aligned with start and end
                      // per the constructor.
            // Replacing centerX in equation 2 yields:
            centerY = this.control.y + slope * (centerX - this.control.x);
        }

        return new Point(centerX, centerY);
    };

    // Overrides the abstract method in the parent class.
    protected computePoint = (t: number): Point => {     
        const x = this.center.x + 
                  this.radius * Math.cos(this.lerp(this.startAngle, this.endAngle, t));
        const y = this.center.y + 
                  this.radius * Math.sin(this.lerp(this.startAngle, this.endAngle, t));
        return new Point(x, y);
    };

    // Overrides the abstract method in the parent class.
    protected _drawTo = (path: Path2D): void => {
        path.arcTo(this.control.x, this.control.y, 
                   this.end.x, this.end.y, 
                   this.radius);
    };

    // Overrides the approximation algorithm in the parent class.
    getLength = (): number => {
        return Math.abs(this.startAngle - this.endAngle) * this.radius;
    };

    translate = (displacement: Vector): void => {
        this.start = Point.translate(this.start, displacement);
        this.control = Point.translate(this.control, displacement);
        this.end = Point.translate(this.end, displacement);
        this.center = Point.translate(this.center, displacement);
    };
}
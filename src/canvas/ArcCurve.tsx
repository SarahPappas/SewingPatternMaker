import { Curve } from "./Curve";
import { Point } from "./Point";
import { Vector } from "./Vector";

export class ArcCurve extends Curve {
    radius: number;
    center: Point;
    startAngle: number;
    endAngle: number;

    // pre: start != end and control != middlePoint between start and end
    // pre: control is equidistant from start and end
    constructor(start: Point, end: Point, control: Point) {
        super(start, end, control);
        if (control.equals(Point.computeMiddlePoint(start, end))) {
            throw new Error("degenerate curve");
        }
        this.center = this._computeCenter();
        this.radius = this.center.distanceTo(start);
        this.startAngle = Vector.vectorBetweenPoints(this.center, start).getAngle();
        this.endAngle = Vector.vectorBetweenPoints(this.center, end).getAngle();
        // make sure we go in the right direction on the circle: always use the shortest
        // way around the circle
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
        
        if (normalVector.x === 0) { // start and end are horizontally aligned
            // the center is aligned vertically with the control point
            centerX = this.control.x;

            // the center of the circle is such that startToControl vector is
            // perpendicular to startToCenter vector    
            // equation: startToControl dot startToCenter = 0      
            centerY = this.start.y - 
                        ((startToControl.x * startToControl.x) 
                            / (startToControl.y));
            //here we safely avoid division by zero because of the check in
            //the constructor: startToControl cannot be horizontal
        } else {
            // the center of the circle is such that startToControl vector is
            // perpendicular to startToCenter vector    
            // equation 1: startToControl dot startToCenter = 0

            // the center of the circle is on the line that goes through the 
            // control point and that is perpendicular to the vector between start and end
            // equation 2: centerY = control + slope * centerX
            const slope = normalVector.y / normalVector.x;
                //division by zero is avoided because of the if check

            // insert equation 2 in equation 1, then solve for centerX
            centerX = (this.start.x * startToControl.x 
                        + (this.control.x * slope - startToControl.y) 
                            * startToControl.y) 
                      / (slope * startToControl.y + startToControl.x);
                      // having the denominator = 0 would mean that startToControl
                      // is perperdicular to the normal which is impossible
                      // since the control is never aligned with start and end
                      // per the constructor
            // replace centerX in equation 2
            centerY = (centerX - this.control.x) * slope + this.control.y;
        }

        return new Point(centerX, centerY);
    }

    computePoint = (t: number): Point => {     
        const x = this.center.x + 
                  this.radius * Math.cos(this.lerp(this.startAngle, this.endAngle, t));
        const y = this.center.y + 
                  this.radius * Math.sin(this.lerp(this.startAngle, this.endAngle, t));
        return new Point(x, y);
    };

    drawCurve = (path: Path2D): void => {
        path.arcTo(this.control.x, this.control.y, 
                   this.end.x, this.end.y, 
                   this.radius);
    }

    // override the approximation algorithm from parent class
    getLength = (): number => {
        const u = Vector.vectorBetweenPoints(this.control, this.start);
        const v = Vector.vectorBetweenPoints(this.control, this.end);
        const alpha = Vector.angleBetween(u, v);
        // theta is the central angle between starting point and end point on the circle
        const theta = Math.PI - alpha;
        return theta * this.radius;
    }
}
import { Curve } from './Curve';
import { Point } from './Point';
import { Vector } from './Vector';
import { LineSegment } from './LineSegment';
import { Segment } from './Segment';

export class ArcCurve extends Curve {
    private radius: number;
    private center: Point;
    private startAngle: number; // Angle from positive x axis to start 
    private endAngle: number;// Angle from positive x axis to end
    private counterClockwise: boolean;

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

        this.counterClockwise = this.startAngle > this.endAngle;
    }

    clone = (): ArcCurve => {
        return new ArcCurve(this.start, this.end, this.control);
    };

    // Overrides the abstract method in the parent class.
    drawTo = (path: Path2D): void => {
        path.arc(this.center.x, this.center.y, this.radius, this.startAngle, this.endAngle, this.counterClockwise);
    };

    // Overrides the approximation algorithm in the parent class.
    getLength = (): number => {
        return Math.abs(this.startAngle - this.endAngle) * this.radius;
    };

    getOffsetSegments = (distance: number): Segment[] => {
        const tangentAtStart = this.getTangent(0);
        const displacementOfStart = Vector.findOpposite(Vector.findPerpVector(tangentAtStart)).normalize().multiplyByScalar(distance);

        const tangentAtEnd = this.getTangent(1);
        const displacementOfEnd = Vector.findOpposite(Vector.findPerpVector(tangentAtEnd)).normalize().multiplyByScalar(distance);

        const result = this.clone();
        result.start = Point.translate(this.start, displacementOfStart);
        result.end = Point.translate(this.end, displacementOfEnd);
        result.radius = result.start.distanceTo(result.center);

        const lengthOfDisplacementOfControl = distance / Math.cos(Math.abs(this.endAngle - this.startAngle) / 2);
        const displacementOfControl = Vector.vectorBetweenPoints(this.center, this.control).normalize().multiplyByScalar(lengthOfDisplacementOfControl);
        result.control = Point.translate(this.control, displacementOfControl);
        // result's center, startAngle and endAngle don't need to be updated.
        return [result];
    };

    getTangent = (t: number): Vector => {
        // The tangent vector is found by calculating the derivative of the parametric equation of the circle arc:
        // C'(t) = ( -(endAngle - startAngle)*r*\sin(startAngle + (endAngle - startAngle)t), (endAngle - startAngle)*r*\cos(startAngle + (endAngle - startAngle)t))
        const x = -1 * (this.endAngle - this.startAngle) * this.radius * Math.sin(this.lerp(this.startAngle, this.endAngle, t));
        const y = (this.endAngle - this.startAngle) * this.radius * Math.cos(this.lerp(this.startAngle, this.endAngle, t));
        return new Vector(x, y);
    };

    reversedClone = (): ArcCurve => {
        return new ArcCurve(this.end, this.start, this.control);
    };

    /* 
    * Splits an arc into two arcs.
    * Precondition: point given must be a point on the arc.
    */
    split = (point: Point): ArcCurve[] => {
        const curves:  ArcCurve[] = [];
        const originToSplitPoint = Vector.vectorBetweenPoints(this.center, point);
        const tangentToArcAtPoint = Vector.findPerpVector(originToSplitPoint);
        const pointOnTangentToArcAtPoint = Point.translate(point, tangentToArcAtPoint);
        const lineOnTangentToArcAtPoint = new LineSegment(point, pointOnTangentToArcAtPoint);
        const lineFromStartToOldControlPoint = new LineSegment(this.start, this.control);

        const control1 = LineSegment.findIntersectionPointOfTwoLines(lineOnTangentToArcAtPoint, lineFromStartToOldControlPoint, false);
        if (!control1) {
            throw new Error('Cannont find control point from first Arc in Arc split');
        }
        curves.push(new ArcCurve(this.start, point, control1));

        const lineFromEndToOldControlPoint = new LineSegment(this.end, this.control);
        const control2 = LineSegment.findIntersectionPointOfTwoLines(lineOnTangentToArcAtPoint, lineFromEndToOldControlPoint, false);
        if (!control2) {
            throw new Error('Cannont find control point from second Arc in Arc split');
        }
        curves.push(new ArcCurve(point, this.end, control2));

        return curves;
    };

    translate = (displacement: Vector): void => {
        this.start = Point.translate(this.start, displacement);
        this.control = Point.translate(this.control, displacement);
        this.end = Point.translate(this.end, displacement);
        this.center = Point.translate(this.center, displacement);
        this.points = this.computePoints();
    };

    private _computeCenter = (): Point => {
        // The center of the circle supporting the arc is the intersection 
        // of two lines: the line through the start point and perpendicular
        // to startToControl, and the line through the end point and
        // perpendicular to endToControl

        // Line 1: through start, perpendicular to startToControl
        const startToControl = Vector.vectorBetweenPoints(this.start, this.control);
        const perpVector1 = Vector.findPerpVector(startToControl);
        const line1 = new LineSegment(this.start, Point.translate(this.start, perpVector1));

        // Line 2: through end, perpendicular to endToControl
        const endToControl = Vector.vectorBetweenPoints(this.end, this.control);
        const perpVector2 = Vector.findPerpVector(endToControl);
        const line2 = new LineSegment(this.end, Point.translate(this.end, perpVector2));

        const center = LineSegment.findIntersectionPointOfTwoLines(line1, line2, false);
        if (!center) {
            throw new Error("could not find the center of the arc");
        }
        return center;
    };

    // Overrides the abstract method in the parent class.
    protected _computePoint = (t: number): Point => {     
        const x = this.center.x + 
                  this.radius * Math.cos(this.lerp(this.startAngle, this.endAngle, t));
        const y = this.center.y + 
                  this.radius * Math.sin(this.lerp(this.startAngle, this.endAngle, t));
        return new Point(x, y);
    };

    protected _equals = (other: Segment): boolean => {
        return (other instanceof ArcCurve) && this.control.equals(other.control);
    };

    /* 
     * Scales arcs. We will not scale by negative scalars, so we don't need to recompute
     * the angles.
     */
    protected _scale = (scalar: number): void => {
        this.start = this.start.scale(scalar);
        this.control = this.control.scale(scalar);
        this.end = this.end.scale(scalar);
        this.center = this._computeCenter();
        this.radius = this.center.distanceTo(this.start);
        this.points = this.computePoints();
    };
}
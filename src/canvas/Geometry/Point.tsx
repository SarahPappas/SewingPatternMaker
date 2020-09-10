import { Vector } from
 './Vector';

export class Point implements IPoint {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals = (other: Point): boolean => {
        const EPSILON = 1e-15;
        return Math.abs(this.x  - other.x) <= EPSILON && Math.abs(this.y - other.y) <= EPSILON;
    };

    isWithinRadius = (other: Point, radius: number): boolean => {
        return this.distanceSquared(other) < radius * radius;
    };
    
    distanceSquared = (other: Point): number => {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx * dx + dy * dy;
    };

    distanceTo = (other: Point): number => {
        return Math.sqrt(this.distanceSquared(other));
    };

    closestDistanceSquaredFromSetOfPoints = (points: Point[]): number => {
        let minDistance = Number.MAX_VALUE;

        for (let i = 0; i < points.length; i++) {
            const distance = this.distanceSquared(points[i]);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        return minDistance;
    };

    clone = (): Point => {
        return new Point(this.x, this.y);
    };

    toString = (): string => {
        return "[" + this.x + ", " + this.y + "]";
    };

    scale = (scalar: number): Point => {
        return new Point(this.x * scalar, this.y * scalar);
    };

    static computeMiddlePoint = (p1: Point, p2: Point): Point => {
        const middleX = (p1.x + p2.x) / 2;
        const middleY = (p1.y + p2.y) / 2;
        
        return new Point(middleX, middleY);
    };

    // Generates points on the line formed by all points that are equidistant 
    // from points p1 and p2.
    // At t=0, it returns the middle point between the two inputted points.
    static getPointOnMidline = (p1: Point, p2: Point, t: number): Point => {
        const middle = Point.computeMiddlePoint(p1, p2);
        const normalVector = Vector.findPerpVector(Vector.vectorBetweenPoints(p1, p2));
        normalVector.normalize();
        return new Point(middle.x + t * normalVector.x, 
                         middle.y + t * normalVector.y);
    };

    static translate = (p: Point, displacement: Vector): Point => {
        return new Point(p.x + displacement.x, p.y + displacement.y);
    };
}
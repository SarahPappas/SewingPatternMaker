import { Vector } from "./Vector";

export class Point implements IPoint {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals = (other: Point): boolean => {
        return this.x === other.x && this.y === other.y;
    }

    isWithinRadius = (other: Point, radius: number): boolean => {
        return this.distanceSquared(other) < radius * radius;
    }
    
    distanceSquared = (other: Point): number => {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx * dx + dy * dy;
    }

    distanceTo = (other: Point): number => {
        return Math.sqrt(this.distanceSquared(other));
    }

    closestDistanceSquaredFromSetOfPoints = (points: Point[]): number => {
        let minDistance = Number.MAX_VALUE;

        for (let i = 0; i < points.length; i++) {
            const distance = this.distanceSquared(points[i]);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        return minDistance;
    }

    static computeMiddlePoint = (p1: Point, p2: Point): Point => {
        const middleX = (p1.x + p2.x) / 2;
        const middleY = (p1.y + p2.y) / 2;
        
        return new Point(middleX, middleY);
    }

    // generates points on the line formed by all points that are equidistant 
    // from points p1 and p2.
    // at t=0, is returns the point in the middle of this point and the other point.
    static getPointOnMidline = (p1: Point, p2: Point, t: number): Point => {
        const middle = Point.computeMiddlePoint(p1, p2);
        const normalVector = Vector.perp(Vector.vectorBetweenPoints(p1, p2));
        normalVector.normalize();
        // TODO: override + and * operations for points and vectors?
        return new Point(middle.x + t * normalVector.x, 
                         middle.y + t * normalVector.y);
    }
}
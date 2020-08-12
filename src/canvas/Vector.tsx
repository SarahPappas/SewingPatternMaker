import { Point } from "./Point";

export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    norm = (): number => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    normalize = (): void => {
        const norm = this.norm();
        if (norm === 0) {
            throw new Error("division by 0");
        }
        this.x /= norm;
        this.y /= norm;
    };

    // returns the angle between this and the (1, 0) vector in radians 
    getAngle = (): number => {
        return Math.atan2(this.y, this.x);
    };

    // constructs vector going from p1 to p2
    static vectorBetweenPoints = (startingPoint: Point, endPoint: Point): Vector => {
        return new Vector(endPoint.x - startingPoint.x, endPoint.y - startingPoint.y);
    };

    static divide = (vector: Vector, value: number) => {
        if (value === 0) {
            throw new Error("division by zero");
        }
        return new Vector(vector.x / value, vector.y / value);
    };

    static dotProduct = (v1: Vector, v2: Vector): number => {
        return v1.x * v2.x + v1.y * v2.y;
    };

    // Computes the angle between 2 vectors.
    static angleBetween = (v1: Vector, v2: Vector): number => {
        if (v1.norm() === 0 || v2.norm() === 0) {
            throw new Error("division by 0");
        }
        return Math.acos(Vector.dotProduct(v1, v2) / (v1.norm() * v2.norm()));
    };

    static findPerpVector = (vector: Vector): Vector => {
        return new Vector(-1 * vector.y, vector.x);
    };
}
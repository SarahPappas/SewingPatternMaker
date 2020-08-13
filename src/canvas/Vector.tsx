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
        this.divideByScalar(this.norm());
    };

    divideByScalar = (value: number) => {
        if (value === 0) {
            throw new Error("division by zero");
        }
        this.x /= value;
        this.y /= value;
    };

    // Returns the angle between this and the (1, 0) vector in radians 
    getAngle = (): number => {
        return Math.atan2(this.y, this.x);
    };

    // Constructs vector going from p1 to p2
    static vectorBetweenPoints = (startingPoint: Point, endPoint: Point): Vector => {
        return new Vector(endPoint.x - startingPoint.x, endPoint.y - startingPoint.y);
    };

    static dotProduct = (v1: Vector, v2: Vector): number => {
        return v1.x * v2.x + v1.y * v2.y;
    };

    // Computes the smallest angle between 2 vectors in radians.
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
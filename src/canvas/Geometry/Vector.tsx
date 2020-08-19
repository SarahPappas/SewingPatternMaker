import { Point } from "./Point";

export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // Returns the norm, or length, of the vector.
    norm = (): number => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    // Rescales the vector in order to make it of length 1.
    normalize = (): void => {
        this.divideByScalar(this.norm());
    };

    // Divides the vector by the inputted value.
    // Throws an Error if the inputted value is zero.
    divideByScalar = (value: number) => {
        if (value === 0) {
            throw new Error("division by zero");
        }
        this.x /= value;
        this.y /= value;
    };

    // Returns the value between -PI and PI that represents the angle between 
    // this vector and the positive x axis.
    getAngle = (): number => {
        return Math.atan2(this.y, this.x);
    };

    // Constructs and returns the vector going from p1 to p2.
    static vectorBetweenPoints = (startingPoint: Point, endPoint: Point): Vector => {
        return new Vector(endPoint.x - startingPoint.x, endPoint.y - startingPoint.y);
    };

    // Returns the value of the dot product between the two inputted vectors.
    static dotProduct = (v1: Vector, v2: Vector): number => {
        return v1.x * v2.x + v1.y * v2.y;
    };

    // Returns the value of the dot product between the two inputted vectors.
    static crossProduct = (v1: Vector, v2: Vector): number => {
        return v1.x * v2.y - v1.y * v2.x; 
    };

    // Computes the smallest angle between 2 vectors in radians.
    // Throws an error of either of the 2 vectors has a norm of 0.
    static angleBetween = (v1: Vector, v2: Vector): number => {
        if (v1.norm() === 0 || v2.norm() === 0) {
            throw new Error("division by 0");
        }
        return Math.acos(Vector.dotProduct(v1, v2) / (v1.norm() * v2.norm()));
    };

    // Returns a vector that is perpendicular to the inputted vector.
    static findPerpVector = (vector: Vector): Vector => {
        return new Vector(-1 * vector.y, vector.x);
    };
}
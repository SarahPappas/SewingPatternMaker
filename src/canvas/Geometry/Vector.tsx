import { Point } from './Point';

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

    // Returns the value in ]-PI, PI] that represents the angle between 
    // this vector and the positive x axis. Returns 0 if this is the zero vector.
    getAngle = (): number => {
        return Math.atan2(this.y, this.x);
    };

    // Returns the vector that points in the opposite direction, i.e. the vector
    // that is at angle PI with this vector and of same length.
    opposite = (): Vector => {
        return new Vector(-1 * this.x, -1 * this.y);
    };

    // Constructs and returns the vector going from p1 to p2.
    static vectorBetweenPoints = (startingPoint: Point, endPoint: Point): Vector => {
        return new Vector(endPoint.x - startingPoint.x, endPoint.y - startingPoint.y);
    };

    // Computes and returns the change in the directional angle from vector v1 to vector v2. 
    // The change in angle is in ]-PI, PI]. The sign of the change indicates the direction
    // of the turn when going from v1 to v2. 
    static changeInAngle = (v1: Vector, v2: Vector): number => {
        let result = v2.getAngle() - v1.getAngle();
        if (result > Math.PI) {
            result = result - 2 * Math.PI;
        } else if (result <= (-1 * Math.PI)) {
            result = result + 2 * Math.PI;
        }
        return result;
    };

    /**
     * Returns a vector that is perpendicular to the inputted vector.
     * The angle of the resulting vector is equal to PI / 2 + the angle of the
     * input vector.
     * 
     * @param vector The inputted vector
     */
    static findPerpVector = (vector: Vector): Vector => {
        return new Vector(-1 * vector.y, vector.x);
    };
}
import { Point } from './Point';

export class Vector implements IVector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Returns the norm, or length, of the vector.
     */
    norm = (): number => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    /**
     * Rescales the vector in order to make it of length 1.
     * Throws an Error if this is the zero vector.
     */
    normalize = (): Vector => {
        const norm = this.norm();
        if (norm === 0) {
            throw new Error("The zero vector cannot be normalized");
        }
        this.x /= norm;
        this.y /= norm;
        return this;
    };

    /**
     * Multiplies the vector by the input scalar value.
     * 
     * @param value the scalar value that will multiply the vector.
     */
    multiplyByScalar = (value: number): Vector => {
        this.x *= value;
        this.y *= value;
        return this;
    };

    /**
     * Returns the value in ]-PI, PI] that represents the angle between 
     * this vector and the positive x axis. Returns 0 if this is the 
     * zero vector.
     */
    getAngle = (): number => {
        return Math.atan2(this.y, this.x);
    };

    /**
     * Constructs and returns the vector describing the displacement 
     * from point p1 to point p2.
     * 
     * @param startingPoint The origin of the vector
     * @param endPoint The destination of the vector
     */
    static vectorBetweenPoints = (startingPoint: Point, endPoint: Point): Vector => {
        return new Vector(endPoint.x - startingPoint.x, endPoint.y - startingPoint.y);
    };

    /**
     * Computes and returns the change in the directional angle from 
     * vector v1 to vector v2. The change in angle is in ]-PI, PI]. 
     * The sign of the change indicates the direction of the turn when 
     * going from v1 to v2. 
     * 
     * @param v1 The first vector
     * @param v2 The second vector
     */
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

    /**
     * Returns the vector that points in the opposite direction as the inputted
     * vector, i.e. the vector that is at angle PI with the inputted vector 
     * and of the same length.
     * 
     * @param vector the original vector
     */
    static findOpposite = (vector: Vector): Vector => {
        return new Vector(-1 * vector.x, -1 * vector.y);
    };

    /**
     * Returns the value of the cross product between the two inputted vectors.
     * 
     * @param v1 The first vector
     * @param v2 The second vector
     */
    static normOfCrossProduct = (v1: Vector, v2: Vector): number => {
        return Math.abs(v1.x * v2.y - v1.y * v2.x); 
    };
}
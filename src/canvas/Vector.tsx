import { Point } from "./Point";

export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // constructs vector going from p1 to p2
    static vectorBetweenPoints(startingPoint: Point, endPoint: Point): Vector {
        return new Vector(endPoint.getX() - startingPoint.getX(), endPoint.getY() - startingPoint.getY());
    }

    static dotProduct = (v1: Vector, v2: Vector): number => {
        return v1.x * v2.x + v1.y * v2.y;
    }

    // Computes the angle between 2 vectors.
    static angleBetween = (v1: Vector, v2: Vector): number => {
        if (v1.norm() === 0 || v2.norm() === 0) {
            throw new Error("division by 0");
        }
        return Math.acos(Vector.dotProduct(v1, v2) / (v1.norm() * v2.norm()));
    }

    norm = (): number => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
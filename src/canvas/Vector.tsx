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

    norm = (): number => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dotProduct = (other: Vector): number => {
        return this.x * other.x + this.y * other.y;
    }

    // Computes the angle between 2 vectors.
    angleBetween = (other: Vector): number => {
        return Math.acos(this.dotProduct(other) / (this.norm() * other.norm()));
    }
}
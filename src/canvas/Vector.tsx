import { Point } from "./Point";

export class Vector {
    x: number;
    y: number;

    // constructs vector going from p1 to p2
    constructor(startingPoint: Point, endPoint: Point) {
        this.x = endPoint.getX() - startingPoint.getX();
        this.y = endPoint.getY() - startingPoint.getY();
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
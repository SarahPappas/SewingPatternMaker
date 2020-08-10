export class Point implements IPoint {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals = (o: Point): boolean => {
        return this.x === o.x && this.y === o.y;
    }

    isWithinRadius = (o: Point, radius: number): boolean => {
        return this.distanceSquared(o) < radius * radius;
    }
    
    distanceSquared = (point: Point): number => {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return dx * dx + dy * dy;
    }

    // generates points on the line formed by all points that are equidistant 
    // from this point and the other point. 
    // at t=0, is returns the point in the middle of this point and the other point.
    getPointOnMidline = (other: Point, t: number): Point => {
        // TODO: use vectors here
        const middle = this.computeMiddlePoint(other);
        const normalVector = [this.y - other.y, other.x - this.x];
        const norm = Math.sqrt(this.distanceSquared(other));
        const normalUnitVector = normalVector.map((value) => (value/norm));
        return new Point(middle.x + t * normalUnitVector[0], middle.y + t * normalUnitVector[1]);
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

    computeMiddlePoint = (other: Point): Point => {
        const middleX = (this.x + other.x) / 2;
        const middleY = (this.y + other.y) / 2;
        
        return new Point(middleX, middleY);
    }
}
export class Point implements IPoint {
    private _x: number;
    private _y: number;

    constructor (x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    getX = (): number => {
        return this._x;
    }

    getY = (): number => {
        return this._y;
    }

    equals = (o: Point): boolean => {
        return this._x === o.getX() && this._y === o.getY();
    }

    distanceSquared = (point: Point): number => {
        const dx = this._x - point.getX();
        const dy = this._y - point.getY();
        return dx * dx + dy * dy;
    }

    closestDistanceSquared = (points: Point[]): number => {
        let minDistance = Number.MAX_VALUE;

        for (let i = 0;i < points.length;i++) {
            const distance = this.distanceSquared(points[i]);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        return minDistance;
    }
}
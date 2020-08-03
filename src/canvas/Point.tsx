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

    isWithinRadius = (o: Point, radius: number): boolean => {
        return Math.pow((o.getX() - this._x), 2) + Math.pow((o.getY() - this._y), 2) < Math.pow(radius, 2);
    }
}
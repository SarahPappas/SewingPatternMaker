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

    middlePoint = (other: Point): Point => {
        return new Point((this._x + other._x)/2, (this._y + other._y)/2);
    }

    // generates points that equidistant from this point and the other point.
    // at t=0, is returns the middle point.
    getPointOnMidline = (other: Point, t: number): Point => {
        const middle = this.middlePoint(other);
        const normalVector = [this._y - other._y, other._x - this._x];
        const norm = Math.sqrt(this.distanceSquared(other));
        const normalUnitVector = normalVector.map((value) => (value/norm));
        return new Point(middle.getX() + t * normalUnitVector[0], middle.getY() + t * normalUnitVector[1]);
    }

    getCenter = (other: Point, control: Point): Point => {
        const normalVector = [this._y - other._y, other._x - this._x];
        const middle = this.middlePoint(other);
        const x = (this._x * (control._x - this._x) + (middle._x * normalVector[1] / normalVector[0] - middle._y + this._y) * (control._y - this._y)) / (normalVector[1] * (control._y - this._y) / normalVector[0] + (control._x - this._x));
        const y = (x - middle._x) * normalVector[1] / normalVector[0] + middle._y;
        return new Point(x, y);
    }

    getRadius = (other: Point, control: Point): number => {
        return Math.sqrt(this.distanceSquared(this.getCenter(other, control)));
    }
}
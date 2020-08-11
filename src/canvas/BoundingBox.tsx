import { Point } from './Point';

export class BoundingBox {
    minX = 0;
    minY = 0;
    height = 0;
    width = 0;
    private maxX = 0;
    private maxY = 0;

    constructor (points: Point[])  { // eslint-disable-line no-dupe-class-members
        if (!points.length) {
            return;
        }

        this.minX = this.maxX = points[0].getX();
        this.minY = this.maxY = points[0].getY();

        this.build(points);
        this.calcHeight();
        this.calcWidth();
    }

    expand = (factor: number): void => {
        // Expand bounds of box of where we will search for a control point.
        const boxCenterX = this.width/2 + this.minX;
        const boxCenterY = this.height/2 + this.minY;

        this.minX = boxCenterX + factor * (this.minX - boxCenterX);
        this.minY = boxCenterY + factor * (this.minY - boxCenterY);
        this.height = this.height * factor;
        this.width = this.width * factor;
        this.maxX = this.minX + this.width;
        this.maxY = this.minY + this.height;
    };

    private build = (points: Point[]): void => {
        points.forEach(point => {
            const x = point.getX();
            const y = point.getY();
            if (x < this.minX) {
                this.minX = x;
            } else if (x > this.maxX) {
                this.maxX = x;
            }

            if (y < this.minY) {
                this.minY = y;
            } else if (y > this.maxY) {
                this.maxY = y;
            }
        });
    };

    private calcHeight = (): void => {
        this.height = this.maxY - this.minY;
    };

    private calcWidth = (): void => {
        this.width = this.maxX - this.minX;
    };
}
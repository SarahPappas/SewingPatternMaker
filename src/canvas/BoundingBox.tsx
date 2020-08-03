import { Point } from './Point';

export class BoundingBox {
    minX: number;
    minY: number;
    height: number;
    width: number;
    private maxX: number;
    private maxY: number;

    constructor ();
    constructor (points: Point[]); // eslint-disable-line no-dupe-class-members
    constructor (points?: Point[])  { // eslint-disable-line no-dupe-class-members
        this.minX = points && points[0].getX() || 0;
        this.minY = points && points[0].getY() || 0;
        this.maxY = points && points[0].getY() || 0;
        this.maxX = points && points[0].getX() || 0;
        this.height = 0;
        this.width = 0;

        if (points) {
            this.build(points);
            this.calcHeight();
            this.calcWidth();
        }
    }

    expand = (): BoundingBox => {
        const retBox = new BoundingBox();
        Object.assign(retBox, this);

        // Expand bounds of box of where we will search for a control point.
        const boxCenterX = retBox.width/2 + retBox.minX;
        const boxCenterY = retBox.height/2 + retBox.minY;

        retBox.minX = boxCenterX + 2.5 * (retBox.minX - boxCenterX);
        retBox.minY = boxCenterY + 2.5 * (retBox.minY - boxCenterY);
        retBox.height = retBox.height * 2.5;
        retBox.width = retBox.width * 2.5;

        return retBox;
    }

    private build = (points: Point[]): void => {
        points.forEach(point => {
            const x = point.getX();
            const y = point.getY();
            if (x < this.minY) {
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
    }

    private calcHeight = (): void => {
        this.height = this.maxY - this.minY;
    }

    private calcWidth = (): void => {
        this.width = this.maxX - this.minX;
    }
}
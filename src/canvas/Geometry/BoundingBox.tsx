import { Point } from './Point';

export class BoundingBox {
    minX = 0;
    minY = 0;
    height = 0;
    width = 0;
    maxX = 0;
    maxY = 0;

    constructor (points: Point[])  { // eslint-disable-line no-dupe-class-members
        if (!points.length) {
            return;
        }

        this.minX = this.maxX = points[0].x;
        this.minY = this.maxY = points[0].y;

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
            const x = point.x;
            const y = point.y;
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

    /* Checks if bounding boxes of two pattern paths overlap. */
    static checkIfBoundingBoxesOverlap = (thisPts: Point[], thatPts: Point[]): boolean => {
        const a = new BoundingBox(thisPts);
        const b = new BoundingBox(thatPts);

        // If one rectangle to the left of the other rectangle, return false.
        if (a.minX > b.maxX || b.minX > a.maxX) {
            return false;
        }

        // If one rectangle is above the other rectangle, return false.
        if (a.minY > b.maxY || b.minY > a.maxY) {
            return false; 
        }

        return true; 
    };
}
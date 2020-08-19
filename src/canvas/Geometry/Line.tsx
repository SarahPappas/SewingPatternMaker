import { Segment } from './Segment';
import { Point } from './Point';
import { Vector } from './Vector';

export class Line extends Segment {
    getLength = (): number => {
        return Math.sqrt(this.start.distanceSquared(this.end));
    };

    isPointOnLine = (point: Point, threshold: number): boolean => {
        const startToPoint = Vector.vectorBetweenPoints(this.start, point);
        const startToEnd = Vector.vectorBetweenPoints(this.start, this.end);

        const cross = Vector.crossProduct(startToPoint, startToEnd);
        
        if(cross > threshold) {
            return false;
        }
        
        const dxl = this.end.x - this.start.x;
        const dyl = this.end.y - this.start.y;

        // Now, as you know that the point does lie on the line, it is time to check whether it lies between the original points. 
        // This can be easily done by comparing the x coordinates, if the line is "more horizontal than vertical", or y coordinates otherwise.
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return this.start.x <= this.end.x ? 
                this.start.x <= point.x && point.x <= this.end.x :
                this.end.x <= point.x && point.x <= this.start.x;
        } else {
            return this.start.y <= this.end.y ? 
                this.start.y <= point.y && point.y <= this.end.y :
                this.end.y <= point.y && point.y <= this.start.y;
        }
    }

    // Finds intersection on line, not necessarily on the segment of the line.
    findIntersectionPoint = (other: Line): Point | null => { 
        // Line AB represented as a1x + b1y = c1 
        const a1 = this.end.y - this.start.y; 
        const b1 = this.start.x - this.end.x; 
        const c1 = a1*(this.start.x) + b1*(this.start.y); 
      
        // Line CD represented as a2x + b2y = c2 
        const a2 = other.end.y - other.start.y; 
        const b2 = other.start.x - other.end.x; 
        const c2 = a2*(other.start.x)+ b2*(other.start.y); 
      
        const determinant = a1*b2 - a2*b1; 
      
        if (determinant === 0) 
        { 
            // The lines are parallel, so return null.
            return null; 
        } else { 
            const x = (b2*c1 - b1*c2)/determinant; 
            const y = (a1*c2 - a2*c1)/determinant; 
            return new Point(x, y);
        } 
    } 

    protected _drawTo = (path: Path2D): void => {
        path.lineTo(this.end.x, this.end.y);
    };
}
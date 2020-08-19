import { Line } from 'canvas/Geometry/Line';
import { PatternPath } from 'canvas/PatternPaths/PatternPath';
import { Point } from './Geometry/Point';
import { Vector } from './Geometry/Vector';

export class PathIntersection {
    intersectionPt: Point | null;
    paths: PatternPath[];

    constructor() {
        this.intersectionPt = null;
        this.paths = [];
    }

    // Finds intersection on line, not necessarily on the segment of the line.
    static findIntersectionPoint = (thisL: Line, thatL: Line): Point | null => { 
        // Line AB represented as a1x + b1y = c1 
        const a1 = thisL.end.y - thisL.start.y; 
        const b1 = thisL.start.x - thisL.end.x; 
        const c1 = a1*(thisL.start.x) + b1*(thisL.start.y); 
      
        // Line CD represented as a2x + b2y = c2 
        const a2 = thatL.end.y - thatL.start.y; 
        const b2 = thatL.start.x - thatL.end.x; 
        const c2 = a2*(thatL.start.x)+ b2*(thatL.start.y); 
      
        const determinant = a1*b2 - a2*b1; 
      
        if (determinant === 0) 
        { 
            // The lines are parallel, so return null.
            return null; 
        }

        const x = (b2*c1 - b1*c2)/determinant; 
        const y = (a1*c2 - a2*c1)/determinant; 
        const possibleIntersection = new Point(x, y);

        // Threshold for checking if a point is on a line. 
        // Range from 0 to 1, with 0 being the tightest and 1 being the loosest.
        const THRESHOLD = .1;
        if (PathIntersection._isPointOnLine(possibleIntersection, thisL, THRESHOLD)
            && PathIntersection._isPointOnLine(possibleIntersection, thatL, THRESHOLD)) {
            return possibleIntersection;
        }

        return null;
    };

    // TODO: Fix bug for curves where intersectin is never found to be on the line. 
    // Possible fixes: larger sample spacing for curvers. Try using points from fitted curves instead.
    private static _isPointOnLine = (point: Point, line: Line, threshold: number): boolean => {
        const startToPoint = Vector.vectorBetweenPoints(line.start, point);
        const startToEnd = Vector.vectorBetweenPoints(line.start, line.end);

        const cross = Vector.crossProduct(startToPoint, startToEnd);
        
        if(cross > threshold) {
            return false;
        }
        
        const dxl = line.end.x - line.start.x;
        const dyl = line.end.y - line.start.y;

        // Now, as you know that the point does lie on the line, it is time to check whether it lies between the original points. 
        // This can be easily done by comparing the x coordinates, if the line is "more horizontal than vertical", or y coordinates otherwise.
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return line.start.x <= line.end.x ? 
                line.start.x <= point.x && point.x <= line.end.x :
                line.end.x <= point.x && point.x <= line.start.x;
        } else {
            return line.start.y <= line.end.y ? 
                line.start.y <= point.y && point.y <= line.end.y :
                line.end.y <= point.y && point.y <= line.start.y;
        }
    };
}
import { Line } from 'canvas/Geometry/Line';
import { PatternPath } from 'canvas/PatternPaths/PatternPath';
import { Point } from './Geometry/Point';
import { Vector } from './Geometry/Vector';
import { BoundingBox } from './Geometry/BoundingBox';
import { Curve } from './Geometry/Curve';

export class PathIntersection {
    intersectionPt: Point | null;
    paths: PatternPath[];

    constructor() {
        this.intersectionPt = null;
        this.paths = [];
    }

    static findIntersection = (point: Point, curPath: PatternPath, allPaths: PatternPath[]): Point | null => {
        const numPointsInCurrPath = curPath.getPoints().length;
        if (!curPath || !numPointsInCurrPath) {
            return null;
        }
        
        // The line segment where we are are searching for interesection should be a line between the current point and last point added.
        let prevPtIndex = numPointsInCurrPath - 1;
        // Keep this, because sometimes onMouseMove has already added this point
        while(prevPtIndex >= 0 && curPath.getPoints()[prevPtIndex].equals(point)) {
            prevPtIndex--;
        }

        if (prevPtIndex < 0) {
            return null;
        }

        const thisL = new Line(curPath.getPoints()[prevPtIndex], point);
        
        for (let i = 0; i < allPaths.length; i++) {
            // If the current path is the path this iteration, do not look for interstection.
            if (allPaths[i] === curPath) {
                return null;
            }

            // Check if paths' bounding boxes overlap, if not paths cannot overlap, so return null.
            if (!PathIntersection.doBoundingBoxesOverlap(curPath, allPaths[i])) {
                return null;
            }
            
            const compareSegment = allPaths[i].getFittedSegment();
            if (!compareSegment) {
                return null;
            }

            // Get points to compare, depending on the Segment type.
            let comparePts: Point [] = [];
            if (compareSegment instanceof Curve) {
                comparePts = compareSegment.computePointsOnCurve(100);
            } else{
                comparePts.push(compareSegment.start);
                comparePts.push(compareSegment.end);
            }

            const firstPtInCompareSegment = comparePts[0];
            const lastPtInCompoareSegment = comparePts[comparePts.length - 1];
            // If the point is within a radius of an endpoint, we should snap to that endpoint.
            if (!point.isWithinRadius(firstPtInCompareSegment, 10) 
                && !point.isWithinRadius(lastPtInCompoareSegment, 10)) {
               
                for (let j = 1; j < comparePts.length; j++ ) {
                    const thatL = new Line(comparePts[j], comparePts[j - 1]);
                    const intersectionPoint = PathIntersection._findPotentialIntersectionPoint(thisL, thatL);
                    if (intersectionPoint) {
                        return intersectionPoint;
                    }
                }
            } else {
                // TODO if with in radius of endpoints, snap.
            }
        }

        return null;
    };

    static doBoundingBoxesOverlap = (thisP: PatternPath, thatP: PatternPath): boolean => {
        const thisBB = new BoundingBox(thisP.getPoints());
        const thatBB = new BoundingBox(thatP.getPoints());

        // If one rectangle to the left of the other rectangle, return false.
        if (thisBB.minX >= thatBB.maxX || thatBB.minX >= thisBB.maxX) {
            return false;
        }

        // If one rectangle is above the other rectangle, return false.
        if (thisBB.minY >= thatBB.maxY || thatBB.minY >= thisBB.maxY) {
            return false; 
        }

        return true; 
    }

    // Finds intersection on line, not necessarily on the segment of the line.
    private static _findPotentialIntersectionPoint = (thisL: Line, thatL: Line): Point | null => { 
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
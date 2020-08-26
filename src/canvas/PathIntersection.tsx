import { Line } from 'canvas/Geometry/Line';
import { PatternPath } from 'canvas/PatternPaths/PatternPath';
import { Point } from './Geometry/Point';
import { Vector } from './Geometry/Vector';
import { BoundingBox } from './Geometry/BoundingBox';
import { FreeLinePath } from './PatternPaths/FreeLinePath';
import { StraightLinePath } from './PatternPaths/StraightLinePath';

export class PathIntersection {
    static splitAtIntersection = (interesection: Point, path: PatternPath) => {
        const originalSegment = path.getSegment();
        const splitSegments = originalSegment.split(interesection);
        if (splitSegments.length !== 2) {
            throw new Error("Split did not return correct number of segments");
        }
        const paths = [];
        if (path instanceof StraightLinePath) {
            paths.push(new StraightLinePath(path.getType(), splitSegments[0]));
            paths.push(new StraightLinePath(path.getType(), splitSegments[1]));
        } else {
            paths.push(new FreeLinePath(path.getType(), splitSegments[0]));
            paths.push(new FreeLinePath(path.getType(), splitSegments[1]));
        }

        return paths;
    };

    /* Finds the intersection of a line segement between point and the last point on currPath and any other patterPath. */
    static findIntersection = (point: Point, curPath: PatternPath, allPaths: PatternPath[]): IIntersection | null => {
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

        const thisLine = new Line(curPath.getPoints()[prevPtIndex], point);
        
        for (let i = 0; i < allPaths.length; i++) {
            // If the current path is the path this iteration, do not look for interstection.
            if (allPaths[i] === curPath) {
                return null;
            }

            // Check if paths' bounding boxes overlap, if not paths cannot overlap, so return null.
            if (!BoundingBox.checkIfBoundingBoxesOverlap(curPath.getPoints(), allPaths[i].getPoints())) {
                return null;
            }

            const thatPoints = allPaths[i].getPoints();
            const thatFirstPoint = thatPoints[0];
            const thatLasPoint = thatPoints[thatPoints.length - 1];
            
            // If the point is within a radius of an endpoint, we should snap to that endpoint.
            if (point.isWithinRadius(thatFirstPoint, 10)) {
                return {point: thatLasPoint, pathCrossed: allPaths[i]};
            }

            if (point.isWithinRadius(thatFirstPoint, 10)) {
                return {point: thatLasPoint, pathCrossed: allPaths[i]};
            }

            return PathIntersection.findIntersectionOfLineSegmentAndPath(thisLine, allPaths[i]);
        }

        return null;
    };

    /* Finds an intersection point of two lines */ 
    static findPotentialIntersectionPointOfTwoLines = (thisL: Line, thatL: Line): Point | null => { 
        // Line AB represented as a1x + b1y = c1 
        const a1 = thisL.getEnd().y - thisL.getStart().y; 
        const b1 = thisL.getStart().x - thisL.getEnd().x; 
        const c1 = a1*(thisL.getStart().x) + b1*(thisL.getStart().y); 
      
        // Line CD represented as a2x + b2y = c2 
        const a2 = thatL.getEnd().y - thatL.getStart().y; 
        const b2 = thatL.getStart().x - thatL.getEnd().x; 
        const c2 = a2*(thatL.getStart().x)+ b2*(thatL.getStart().y); 
      
        const determinant = a1*b2 - a2*b1; 
      
        if (determinant === 0) 
        { 
            // The lines are parallel, so return null.
            return null; 
        }

        const x = (b2*c1 - b1*c2)/determinant; 
        const y = (a1*c2 - a2*c1)/determinant; 
        return new Point(x, y);
    };

    private static findIntersectionOfLineSegmentAndPath = (lineSegment: Line, path: PatternPath): IIntersection | null => {
        const points = path.getPoints();
        for (let i = 1; i < points.length; i++ ) {
            const thatLine = new Line(points[i], points[i - 1]);
            const intersectionPoint = PathIntersection.findIntersectionPointOfTwoLineSegments(lineSegment, thatLine);
            if (intersectionPoint) {
                return {point: intersectionPoint, pathCrossed: path};
            }
        }
        return null;
    };

    /* Finds intersection on a line segment by frist finding the intersection of the two lines,
       then checking to see if that intersection point is within the line segment.*/
    private static findIntersectionPointOfTwoLineSegments = (thisL: Line, thatL: Line): Point | null => {
        const potentialIntersectionPoint = PathIntersection.findPotentialIntersectionPointOfTwoLines(thisL, thatL);

               // Threshold for checking if a point is on a line. 
        // Range from 0 to 1, with 0 being the tightest and 1 being the loosest.
        const THRESHOLD = .1;
        if (potentialIntersectionPoint &&
            PathIntersection._isPointOnLineSegment(potentialIntersectionPoint, thisL, THRESHOLD)
            && PathIntersection._isPointOnLineSegment(potentialIntersectionPoint, thatL, THRESHOLD)) {
            return potentialIntersectionPoint;
        }

        return null;
    };

    /* Checks if a point is on a line segement. */
    private static _isPointOnLineSegment = (point: Point, line: Line, threshold: number): boolean => {
        const startToPoint = Vector.vectorBetweenPoints(line.getStart(), point);
        const startToEnd = Vector.vectorBetweenPoints(line.getStart(), line.getEnd());

        const cross = Vector.crossProduct(startToPoint, startToEnd);
        
        if(cross > threshold) {
            return false;
        }
        
        const dxl = line.getEnd().x - line.getStart().x;
        const dyl = line.getEnd().y - line.getStart().y;

        // Now we know that the point does lie on the line, it is time to check whether it lies between the original points. 
        // This can be easily done by comparing the x coordinates, if the line is "more horizontal than vertical", or y coordinates otherwise.
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return line.getStart().x <= line.getEnd().x ? 
                line.getStart().x <= point.x && point.x <= line.getEnd().x :
                line.getEnd().x <= point.x && point.x <= line.getStart().x;
        } else {
            return line.getStart().y <= line.getEnd().y ? 
                line.getStart().y <= point.y && point.y <= line.getEnd().y :
                line.getEnd().y <= point.y && point.y <= line.getStart().y;
        }
    };
}
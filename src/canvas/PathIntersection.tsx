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

    /* Checks for an intersection between one patternPath and an array of pattern paths */
    static findIntersectionOfPatternPathsByLineSeg = (thisPath: PatternPath, paths: PatternPath[]): IIntersection | null => {
        if (!thisPath || !paths) {
            return null;
        }

        const pointsOnThisPath = thisPath.getPoints();
        if (pointsOnThisPath.length < 2) {
            return null;
        }

        const lastPointOnThisPath = pointsOnThisPath[pointsOnThisPath.length - 1];
        const prevPointOnThisPath = pointsOnThisPath[pointsOnThisPath.length - 2];
        const thisLineSeg = new Line(prevPointOnThisPath, lastPointOnThisPath);
        for (let i = 0; i < paths.length; i++) {
            const thatPath = paths[i];
            if (thisPath === thatPath) {
                continue;
            }

            const pointsOnThatPath = thatPath.getPoints();
            // Check if paths' bounding boxes overlap, if not paths cannot overlap, so return null.
            if (!BoundingBox.checkIfBoundingBoxesOverlap(pointsOnThisPath, pointsOnThatPath)) {
                continue;
            }

            const intersection = PathIntersection._findIntersectionOfLineSegmentAndPath(thisLineSeg, thatPath);
            if (intersection) {
                return intersection;
            }
        }

        return null;
    };

    /* Finds the intersection between a lineSegment and a path by taking each pair of consecutive points
       and creating a line segment to check for an intersection on. */
    private static _findIntersectionOfLineSegmentAndPath = (thisLineSeg: Line, path: PatternPath): IIntersection | null => {
        const points = path.getPoints();
        for (let i = 1; i < points.length; i++ ) {
            const thatLineSeg = new Line(points[i], points[i - 1]);
            const intersectionPoint = PathIntersection._findIntersectionPointOfTwoLineSegments(thisLineSeg, thatLineSeg);
            if (intersectionPoint) {
                return {point: intersectionPoint, pathCrossed: path};
            }
        }

        return null;
    };

    /* Finds intersection on a line segment by frist finding the intersection of the two lines,
       then checking to see if that intersection point is within the line segment.*/
    private static _findIntersectionPointOfTwoLineSegments = (thisL: Line, thatL: Line): Point | null => {
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
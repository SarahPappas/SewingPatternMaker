import { Line } from 'canvas/Geometry/Line';
import { PatternPath } from 'canvas/PatternPaths/PatternPath';
import { Point } from './Geometry/Point';
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

    /* Finds if the start point of a path intersects with any other path, and if so, returns that intersection point.*/
    static findPathStartIntersectAlongPatternPath = (path: PatternPath, paths: PatternPath[]): IIntersection | null => {
        for (let i = 0; i < paths.length; i++) {
            const thatPath = paths[i];
            if (path === thatPath) {
                continue;
            }

            const thatPathPoints = thatPath.getPoints();
            const intersectionPoint = thatPath.getFittedSegment()?.isPointNearSegment(path.getPoints()[0], 10);
            if (intersectionPoint?.equals(thatPathPoints[0]) || intersectionPoint?.equals(thatPathPoints[thatPathPoints.length - 1])) {
                continue;
            }

            if (intersectionPoint) {
                return {point: intersectionPoint, pathCrossed: thatPath};
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
     * then checking to see if that intersection point is within the line segment.
     * TODO: Implement optimzation to make intersectin check quicker. We discussed possibly using this algorithm:
     * https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
    */
    private static _findIntersectionPointOfTwoLineSegments = (thisL: Line, thatL: Line): Point | null => {
        const potentialIntersectionPoint = PathIntersection.findPotentialIntersectionPointOfTwoLines(thisL, thatL);

        // Threshold for checking if a point is on a line. 
        // Range from 0 to 1, with 0 being the tightest and 1 being the loosest.
        const THRESHOLD = .1;
        if (potentialIntersectionPoint &&
            thisL.isPointOnLineSegment(potentialIntersectionPoint, THRESHOLD) &&
            thatL.isPointOnLineSegment(potentialIntersectionPoint, THRESHOLD)) {
            return potentialIntersectionPoint;
        }

        return null;
    };
}
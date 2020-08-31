import { Line } from 'canvas/Geometry/Line';
import { PatternPath } from 'canvas/PatternPaths/PatternPath';
import { BoundingBox } from './Geometry/BoundingBox';

export class PathIntersection {
    /* 
     * Checks for an intersection between the last segment of one pattern path and line segments formed from the 
     * array of inputted pattern paths.
     * */
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

            /* 
             * If the intersection we find is within a 10 pt raidus of the first point of this path, 
             * keep looking for intersections. 
             */
            const intersection = PathIntersection._findIntersectionOfLineSegmentAndPath(thisLineSeg, thatPath);
            if (intersection && intersection.point.isWithinRadius(pointsOnThisPath[0], 10)) {
                continue;
            }

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
        // Threshold for checking if a point is on a line. Range from 0 to 1, with 0 being the tightest and 1 being the loosest.
        const THRESHOLD = .1;
        const points = path.getPoints();
        for (let i = 1; i < points.length; i++ ) {
            const thatLineSeg = new Line(points[i], points[i - 1]);
            const intersectionPoint = Line.findIntersectionPointOfTwoLines(thisLineSeg, thatLineSeg, true, THRESHOLD);
            if (intersectionPoint ) {
                return {point: intersectionPoint, pathCrossed: path};
            }
        }

        return null;
    };
}
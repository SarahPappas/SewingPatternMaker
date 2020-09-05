import { LineSegment } from 'canvas/Geometry/LineSegment';
import { PatternPath } from 'canvas/PatternPaths/PatternPath';
import { BoundingBox } from './Geometry/BoundingBox';
import { Point } from './Geometry/Point';
import { TracingPath } from './TracingPaths/TracingPath';

export class PathIntersection {
    /**
     * Checks for an intersection between the line segment formed by the last two points 
     * of one tracing path and line segments formed from the array of inputted pattern paths.
     */
    static findIntersectionOfPatternPathsByLineSeg = (thisPath: TracingPath, paths: PatternPath[]): IIntersection | null => {
        if (!thisPath || !paths) {
            return null;
        }

        const pointsOnThisPath = thisPath.getPoints();
        if (pointsOnThisPath.length < 2) {
            return null;
        }

        const lastPointOnThisPath = pointsOnThisPath[pointsOnThisPath.length - 1];
        const prevPointOnThisPath = pointsOnThisPath[pointsOnThisPath.length - 2];
        const thisLineSeg = new LineSegment(prevPointOnThisPath, lastPointOnThisPath);
        for (let i = 0; i < paths.length; i++) {
            const thatPath = paths[i];

            const pointsOnThatPath = thatPath.getPoints();
            // Check if paths' bounding boxes overlap. If not, paths cannot intersect, so skip to next path.
            if (!BoundingBox.checkIfBoundingBoxesOverlap(pointsOnThisPath, pointsOnThatPath)) {
                continue;
            }

            // If the intersection we find is within a 10 pt raidus of the first point of this path, 
            // keep looking for intersections. 
            const intersection = PathIntersection._findIntersectionOfLineSegmentAndPath(thisLineSeg, thatPath);
            if (intersection && !intersection.point.isWithinRadius(pointsOnThisPath[0], 10)) {
                return intersection;
            }
        }

        return null;
    };

    /**
     * Finds if a point intersects with any path, and if so, returns that intersection point.
     * 
     * Precondition: the point has been determined not close enough to endpoints to snap to them.
     */ 
    static findPointIntersectAlongPatternPaths = (point: Point, paths: PatternPath[]): IIntersection | null => {
        for (let i = 0; i < paths.length; i++) {
            const thatPath = paths[i];
            const thatPathSegments = thatPath.getSegments();
            let intersectionPoint = null;
            let segmentIndex;
            for (segmentIndex = 0; !intersectionPoint && segmentIndex < thatPathSegments.length; segmentIndex++) {
                intersectionPoint = thatPathSegments[segmentIndex].isPointNearSegment(point, 10);
            }

            if (intersectionPoint) {
                // cancel the last increment so the segmentIndex is the index of the intersection
                const indexOfSegmentCrossed = segmentIndex - 1;
                return { point: intersectionPoint, pathCrossed: thatPath, indexOfSegmentCrossed: indexOfSegmentCrossed };
            }
        }
        return null;
    };

    /**
     * Finds the intersection between a lineSegment and a path by taking each pair 
     * of consecutive points on the path and creating a line segment between them 
     * to check for an intersection on.
     * 
     * Ignores intersection points that are on the endpoints of the path.
     */
    private static _findIntersectionOfLineSegmentAndPath = (thisLineSeg: LineSegment, path: PatternPath): IIntersection | null => {
        // Threshold for checking if a point is on a line. Range from 0 to 1, with 0 being the tightest and 1 being the loosest.
        const THRESHOLD = .01;
        const segments = path.getSegments();
        for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
            const segment = segments[segmentIndex];
            const segmentPoints = segment.getPoints();
            for (let j = 1; j < segmentPoints.length; j++ ) {
                const thatLineSeg = new LineSegment(segmentPoints[j], segmentPoints[j - 1]);
                const intersectionPoint = LineSegment.findIntersectionPointOfTwoLines(thisLineSeg, thatLineSeg, true, THRESHOLD);
                if (intersectionPoint && !intersectionPoint.equals(path.getStart()) && !intersectionPoint.equals(path.getEnd())) {
                    return { point: intersectionPoint, pathCrossed: path, indexOfSegmentCrossed: segmentIndex };
                }
            }
        }

        return null;
    };
}
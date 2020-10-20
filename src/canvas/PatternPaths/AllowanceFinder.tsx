import { PatternPath } from "./PatternPath";
import { Point } from "canvas/Geometry/Point";
import { Segment } from "canvas/Geometry/Segment";
import { LineSegment } from "canvas/Geometry/LineSegment";
import { PatternPathType } from "canvas/Enums";
import { PathIntersection } from "canvas/PathIntersection";

export class AllowanceFinder {
    /**
     * Computes and returns an array of PatternPaths that represent the allowance lines
     * of all the pattern lines of this pattern piece, spacing them outwards of the pattern 
     * piece at a distance specified by the inputted map and the PatternPaths' types.
     * 
     * @param paths The PatternPaths we are computing allowances for.
     * @param allowanceSizes The map indicating the width of the allowance that each type 
     *                       of PatternPath should have.
     */
    public static computeAllowancePaths = (paths: PatternPath[], allowanceSizes: Map<PatternPathType, number>): PatternPath[] => {
        // First, compute the allowance paths.
        // These are prolonged paths that run parallel to the edges.
        const allowances: PatternPath[] = [];
        paths.forEach((path) => {
            const allowanceSize = allowanceSizes.get(path.getType());
            if (allowanceSize === undefined) {
                throw new Error("Could not determine the allowance size for the path type " + path.getType());
            }
            allowances.push(AllowanceFinder._findAllowance(path, allowanceSize));
        });

        // Then, edge by edge, find the intersection between the allowance of 
        // an edge and the allowance of the next and shorten the allowances
        // accordingly
        const numAllowances = allowances.length;
        for (let i = 0; i < numAllowances; i++) {
            const intersections = AllowanceFinder._findIntersectionBetweenPaths(allowances[i], allowances[(i + 1) % numAllowances]);
            if (intersections) {
                allowances[i].trimAtPoint(intersections[0].point, intersections[0].indexOfSegmentCrossed, false);
                allowances[(i + 1) % numAllowances].trimAtPoint(intersections[1].point, intersections[1].indexOfSegmentCrossed, true);
            } else {
                // If no intersection was found, join the two allowance paths by adding a line segment at the end of the
                // first allowance
                allowances[i].addSegment(new LineSegment(allowances[i].getEnd(), allowances[(i + 1) % numAllowances].getStart()));
            }
            
        }
        return allowances;
    };

    private static _findAllowance = (path: PatternPath, allowanceSize: number): PatternPath => {
        if (path.getType() === PatternPathType.Allowance) {
            throw new Error("Cannot find the allowance of an allowance.");
        }
        
        // Get the path that is offset from this one
        let offsetSegments: Segment[] = [];
        path.getSegments().forEach(segment => {
            offsetSegments = offsetSegments.concat(segment.getOffsetSegments(allowanceSize));
        });
        const lengthOfLineSegmentProlongations = 600;
    
        // Add a line segment at the beginning of the offset path,
        // following the tangent of the offset at that point  
        const firstSegment = offsetSegments[0];      
        const p1 = firstSegment.getStart();
        const p2 = Point.translate(p1, firstSegment.getTangent(0).normalize().multiplyByScalar(-1 * lengthOfLineSegmentProlongations));
        
        // Add a line segment at the end of the offset path,
        // following the tangent of the offset at that point
        const lastSegment = offsetSegments[offsetSegments.length - 1];
        const q1 = lastSegment.getEnd();
        const q2 = Point.translate(q1, lastSegment.getTangent(1).normalize().multiplyByScalar(lengthOfLineSegmentProlongations));
        
        let result: Segment[] = [new LineSegment(p2, p1)];
        result = result.concat(offsetSegments);
        result.push(new LineSegment(q1, q2));
        return new PatternPath(PatternPathType.Allowance, result);
    };

    /**
     * If the two inputted paths have no intersection, returns null. Otherwise, returns
     * an array containing two intersections, both containing the same intersections point,
     * each describing which path is being intersected and on which segment the
     * intersection happens.
     * 
     * If path1 and path2 have more than 1 intersection, the method will only find and return the
     * intersection that is closest to the end of path1 and the start of path 2.
     * 
     * @param path1 The first PatternPath
     * @param path2 The second PatternPath
     */
    private static _findIntersectionBetweenPaths = (path1: PatternPath, path2: PatternPath): IIntersection[] | null => {
        // In order to trim the allowances correctly, we need to find the intersection 
        // between path1 and path2 that is closest to the end of path1 and to the start of path 2.
        // In order to do that, we explore path1 in reverse direction and path2 in regular direction
        
        const reversedPath1 = path1.reversedClone();
        const reversedPath1Segments = reversedPath1.getSegments();
        const numSegmentsIn1 = reversedPath1Segments.length;
        for (let segmentIndex = 0; segmentIndex < numSegmentsIn1; segmentIndex++) {
            const segmentPoints = reversedPath1Segments[segmentIndex].getPoints();
            for (let j = 1; j < segmentPoints.length; j++) {
                const lineSeg = new LineSegment(segmentPoints[j - 1], segmentPoints[j]);
                const intersectionOnPath2 = PathIntersection.findIntersectionOfLineSegmentAndPath(lineSeg, path2);
                if (intersectionOnPath2) {
                    return [
                        // Intersection on original path 1 (not reversed)
                        {
                            point: intersectionOnPath2.point,
                            pathCrossed: path1,
                            indexOfSegmentCrossed: numSegmentsIn1 - segmentIndex - 1
                        }, 
                        intersectionOnPath2
                    ];
                }
            }
        }      
        return null;
    };
}
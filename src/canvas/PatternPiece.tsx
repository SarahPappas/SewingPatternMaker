import { PatternPath } from './PatternPaths/PatternPath';
import { Vector } from 'canvas/Geometry/Vector';
import { LineSegment } from './Geometry/LineSegment';
import { PathIntersection } from './PathIntersection';

export class PatternPiece {
    private _paths: PatternPath[];
    private _allowancePaths: PatternPath[];

    /**
     * Constructs a PatternPiece object from the provided 
     * PatternPath array.
     * 
     * @param paths ordered paths going counterclockwise 
     *              around the piece. The end of a path should
     *              be the exact same point as the start of the
     *              following path
     */
    constructor(paths: PatternPath[]) {
        this._paths = paths;
        this._allowancePaths = this._computeAllowancePaths();
    }
    
    /**
     * Returns all of the PatternPath edges and PatternPath 
     * allowances of the pattern piece
     */
    getAllPaths = (): PatternPath[] => {
        return [...this._paths, ...this._allowancePaths];
    };

    /**
     * Translates the patternPiece in the plane following the
     * provided displacement vector.
     * 
     * @param displacement 
     */
    translate = (displacement: Vector): void => {
        this._paths.forEach(path => {
            path.translate(displacement);
        });
        this._allowancePaths.forEach(path => {
            path.translate(displacement);
        });
    };

    private _computeAllowancePaths = (): PatternPath[] => {
        // First, compute the allowance paths.
        // These are prolonged paths that run parallel to the edges.
        const allowances = this._paths.map(path => path.getAllowance());

        // Then, edge by edge, find the intersection between the alloance of 
        // an edge and the allowance of the next and shorten the allowances
        // accordingly
        const numAllowances = allowances.length;
        for (let i = 0; i < numAllowances; i++) {
            const intersections = this._findIntersectionBetweenPaths(allowances[i], allowances[(i + 1) % numAllowances]);
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

    private _findIntersectionBetweenPaths = (path1: PatternPath, path2: PatternPath): IIntersection[] | null=> {
        // find first encountered intersection of paths, exploring path1 in reverse direction and path2 in regular direction
        
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
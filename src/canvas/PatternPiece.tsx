import { PatternPath } from './PatternPaths/PatternPath';
import { Vector } from 'canvas/Geometry/Vector';
import { LineSegment } from './Geometry/LineSegment';
import { PathIntersection } from './PathIntersection';
import { PatternPathType } from './Enums';
import { AllowanceFinder } from './PatternPaths/AllowanceFinder';
import { Point } from './Geometry/Point';
import { BoundingBox } from './Geometry/BoundingBox';

export class PatternPiece {
    private _paths: PatternPath[];
    private _allowancePaths: PatternPath[];
    private _allowanceSizes: Map<PatternPathType, number>;

    /**
     * Constructs a PatternPiece object from the provided 
     * PatternPath array.
     * 
     * @param paths ordered paths going counterclockwise 
     *              around the piece. The end of a path should
     *              be the exact same point as the start of the
     *              following path
     */
    constructor(paths: PatternPath[], allowanceSizes: Map<PatternPathType, number>) {
        this._paths = paths;
        this._allowancePaths = this._computeAllowancePaths(allowanceSizes);
        this._allowanceSizes = allowanceSizes;
    }

    /**
     * Returns a copy of the PatternPiece.
     */
    clone = (): PatternPiece => {
        return new PatternPiece(this._paths.map(path => path.clone()), this._allowanceSizes);
    }
    
    /**
     * Returns all of the PatternPath edges and PatternPath 
     * allowances of the pattern piece
     */
    getAllPaths = (): PatternPath[] => {
        return [...this._paths, ...this._allowancePaths];
    };

    /**
     * Returns the bounding box for the pattern piece.
     */
    getBoundingBox = (): BoundingBox => {
        let points: Point[] = [];
        this._allowancePaths.forEach(path => {
            points = points.concat(path.getPoints());
        });

        return new BoundingBox(points);
    }

    /**
     * Scales the patternPiece by the provided scalar.
     * 
     * @param scalar 
     */
    scale = (scalar: number): void => {
        this._paths.forEach(path => {
            path.scale(scalar);
        });

        // Allowance sizes must be scaled for cloning
        this._allowanceSizes.forEach((value, key) => {
            this._allowanceSizes.set(key, value * scalar);
        });

        this._allowancePaths.forEach(path => {
            path.scale(scalar);
        });
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

    /**
     * Computes and returns an array of PatternPaths that represent the allowance lines
     * of all the pattern lines of this pattern piece, spacing them outwards of the pattern 
     * piece at a distance specified by the inputted map and the PatternPaths' types.
     * 
     * @param allowanceSizes The map indicating the width of the allowance that each type 
     *                       of PatternPath should have.
     */
    private _computeAllowancePaths = (allowanceSizes: Map<PatternPathType, number>): PatternPath[] => {
        // First, compute the allowance paths.
        // These are prolonged paths that run parallel to the edges.
        const allowances: PatternPath[] = [];
        this._paths.forEach((path) => {
            const allowanceSize = allowanceSizes.get(path.getType());
            if (allowanceSize === undefined) {
                throw new Error("Could not determine the allowance size for the path type " + path.getType());
            }
            allowances.push(AllowanceFinder.FindAllowance(path, allowanceSize));
        });

        // Then, edge by edge, find the intersection between the allowance of 
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
    private _findIntersectionBetweenPaths = (path1: PatternPath, path2: PatternPath): IIntersection[] | null => {
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
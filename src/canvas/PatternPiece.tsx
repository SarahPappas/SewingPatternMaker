import { PatternPath } from './PatternPaths/PatternPath';
import { Vector } from 'canvas/Geometry/Vector';
import { Point } from './Geometry/Point';
import { BoundingBox } from './Geometry/BoundingBox';

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
    constructor(paths: PatternPath[], allowancePaths: PatternPath[]) {
        this._paths = paths;
        this._allowancePaths = allowancePaths;
    }

    /**
     * Returns a copy of the PatternPiece.
     */
    clone = (): PatternPiece => {
        return new PatternPiece(this._paths.map(path => path.clone()), this._allowancePaths.map(path => path.clone()));
    };
    
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
     * Returns all of the PatternPath edges and PatternPath 
     * allowances of the pattern piece
     */
    getPatternPaths = (): PatternPath[] => {
        return [...this._paths];
    };

    /**
     * Scales the patternPiece by the provided scalar.
     * 
     * @param scalar 
     */
    scale = (scalar: number): void => {
        this._paths.forEach(path => {
            path.scale(scalar);
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
}
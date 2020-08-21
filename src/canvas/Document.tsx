import { PatternPath } from './PatternPaths/PatternPath';
import { Point } from './Geometry/Point';
import { FaceFinder } from './Geometry/FaceFinder';
import { Vector } from './Geometry/Vector';

export class Document implements IDocument {
    private _patternPaths: PatternPath[];
    private _sizeRatio: null | number; // in pixels per inch
    private _spreadPatternPaths: null | PatternPath[];

    constructor () {
        this._patternPaths = new Array<PatternPath>();
        this._sizeRatio = null;
        this._spreadPatternPaths = null;
    }

    getPatternPaths = (): PatternPath[] => {
        if (!this._spreadPatternPaths) {
            return [...this._patternPaths];
        } else {
            return this._spreadPatternPaths;
        }
    };

    addPatternPath = (patternPath: PatternPath): boolean => {
        const originalPatternPathslength = this._patternPaths.length;
        
        if (this._patternPaths.push(patternPath) > originalPatternPathslength) {
            return true;
        }

        return false;  
    };

    // Removes the most recently added Pattern Path.
    removePatternPath = (): boolean => {
        if (!this._patternPaths.length) {
            throw new Error("Tried to remove path from document, but there are no paths to remove");
        }
        return Boolean(this._patternPaths.pop());
    };

    arePatternPiecesEnclosed = (): boolean => {
        const endpoints: {point: Point; matched: boolean}[] = [];

        this._patternPaths.forEach(path => {
            const points = path.getPoints();
            endpoints.push({point: points[0], matched: false});
            endpoints.push({point: points[points.length - 1], matched:false});
        });

        for(let i = 0; i < endpoints.length; i++) {
            const point = endpoints[i].point;
            const matched = endpoints[i].matched;
            if (matched) {
                continue;
            }

            // Check if end point matches any other endpoint.
            for (let j = 0; j < endpoints.length && !endpoints[i].matched; j++) {
                const o = endpoints[j];

                if (o === endpoints[i]) {
                    continue;
                }

                if (point.equals(o.point)) {
                    endpoints[i].matched = true;
                    endpoints[j].matched = true;
                }
            }

            // TODO: Check if end points are on line.

            if (!endpoints[i].matched) {
                return false;
            }
        }

        return true;

    };

    isEmpty = (): boolean => {
        return !this._patternPaths.length;
    };

    // Sets the pixels per inch ratio according to the input measurement.
    setSizeRatio = (inputMeasurementInInches: number, selectedPath: PatternPath): void => {
        this._sizeRatio = selectedPath.getLengthInPixels() / inputMeasurementInInches;
    };

    getSizeRatio = (): number => {
        if (!this._sizeRatio) {
            console.log('error: the resizing ratio is not defined.');
            return -1;
        } 
        return this._sizeRatio;        
    };
    
    // Precondition: arePatternPiecesEnclosed returned true 
    findPatternPieces = (): void => {
        const segments = this._patternPaths.map(path => path.getSegment());
        const faces = FaceFinder.FindFaces(segments);
        const patternPieces = faces.map(face => face.map(i => this._patternPaths[i]));
        
        // Logging the pattern pieces for debugging
        patternPieces.forEach(patternPiece => {
            console.log("pattern piece: ");
            patternPiece.forEach(patternPath => {
                console.log("patternPath: type " + patternPath.getType().toString() + ", length " + patternPath.getLengthInPixels());
            });
        });

        this.spreadPatternPieces(patternPieces);
    };

    /**
     * 
     */
    spreadPatternPieces = (patternPieces: PatternPath[][]): void => {
        let result: PatternPath[] = [];

        for (let i = 0; i < patternPieces.length; i++) {
            patternPieces[i].forEach(path => {
                path.translate(new Vector(50*i, 0));
            });
            result = result.concat(patternPieces[i]);
        }

        this._spreadPatternPaths = result;
    };
}
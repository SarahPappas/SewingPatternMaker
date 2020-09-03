import { PatternPath } from './PatternPaths/PatternPath';
import { Point } from './Geometry/Point';
import { FaceFinder } from './Geometry/FaceFinder';

export class Document implements IDocument {
    private _patternPaths: PatternPath[];
    private _patternPathsTrash: IPatternPathTrash[];
    private _sizeRatio: null | number; // in pixels per inch
    private _patternPieces: PatternPath[][]; // an array of patternpath arrays, 
                                             // each representing one piece of the pattern

    constructor () {
        this._patternPaths = new Array<PatternPath>();
        this._patternPathsTrash =[];
        this._sizeRatio = null;
        this._patternPieces = [];
    }

    getPatternPaths = (): PatternPath[] => {
        return [...this._patternPaths];
    };

    addPatternPath = (patternPath: PatternPath): boolean => {
        const originalPatternPathslength = this._patternPaths.length;
        
        if (this._patternPaths.push(patternPath) > originalPatternPathslength) {
            return true;
        }

        return false;  
    };

    emptyPatternPathsTrash = (): void => {
        this._patternPathsTrash = [];
    };

    getPatternPathsTrash = (): IPatternPathTrash[] => {
        return [...this._patternPathsTrash];
    };

    // Removes the most recently added Pattern Path and adds it to the patterPathTrash.
    removePatternPath = (): boolean => {
        if (!this._patternPaths.length) {
            throw new Error("Tried to remove path from document, but there are no paths to remove");
        }

        const removedPath = this._patternPaths.pop();
        if (removedPath) {
            this._patternPathsTrash.push({path: removedPath, replacement: []});
        }

        return Boolean(removedPath);
    };

    // Removes a specific Pattern Path and adds it to the patterPathTrash.
    removeSpecificPatternPath = (path: PatternPath): number => {
        const find = (p: PatternPath) => p === path;
        const pathIndex = this._patternPaths.findIndex(find);
        if (pathIndex >= 0) {
            this._patternPathsTrash.push({path: this._patternPaths[pathIndex], replacement: []});
            this._patternPaths.splice(pathIndex, 1);
            return pathIndex;
        }

        return -1;
    };

    replacePatternPath = (pathToReplace: PatternPath, pathsToInsert: PatternPath[]): void => {
        const find = (p: PatternPath) => p === pathToReplace;
        const pathIndex = this._patternPaths.findIndex(find);
        if (pathIndex >= 0) {
            const trash = {path: this._patternPaths[pathIndex], replacement: pathsToInsert};
            this._patternPathsTrash.push(trash);

            this._patternPaths.splice(pathIndex, 1, ...pathsToInsert);
        }
    };

    arePatternPiecesEnclosed = (): boolean => {
        const endpoints: {point: Point; matched: boolean}[] = [];

        this._patternPaths.forEach(path => {
            endpoints.push({point: path.getStart(), matched: false});
            endpoints.push({point: path.getEnd(), matched:false});
        });

        for(let i = 0; i < endpoints.length; i++) {
            const point = endpoints[i].point;
            const matched = endpoints[i].matched;
            if (matched) {
                continue;
            }

            // Check if end point matches any other endpoint.
            for (let j = i + 1; j < endpoints.length; j++) {
                const o = endpoints[j];

                if (o.matched) {
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
        this._patternPieces = faces.map(face => face.map(i => this._patternPaths[i]));
        
        // Logging the pattern pieces for debugging
        this._patternPieces.forEach(patternPiece => {
            console.log("pattern piece: ");
            patternPiece.forEach(patternPath => {
                console.log("patternPath: type " + patternPath.getType().toString() + ", length " + patternPath.getLengthInPixels());
            });
        });
    };
}
import { PatternPath } from './PatternPaths/PatternPath';
import { Point } from './Geometry/Point';
import { FaceFinder } from './Geometry/FaceFinder';
import { PatternPathType } from './Enums';
import { PatternPiece } from './PatternPiece';
import { Vector } from './Geometry/Vector';
import { AllowanceFinder } from './PatternPaths/AllowanceFinder';

export class Document implements IDocument {
    private _patternPaths: PatternPath[];
    private _patternPathsTrash: IPatternPathTrash[];
    private _pixelsPerInch: null | number; // in pixels per inch
    private _patternPieces: PatternPiece[] | null;
    private _allowanceSizes: Map<PatternPathType, number> | null; // allowance sizes in pixels
    

    constructor () {
        this._patternPaths = new Array<PatternPath>();
        this._patternPathsTrash = [];
        this._pixelsPerInch = null;
        this._patternPieces = null;
        this._allowanceSizes = null;
    }

    addPatternPath = (patternPath: PatternPath): boolean => {
        const originalPatternPathslength = this._patternPaths.length;
        
        if (this._patternPaths.push(patternPath) > originalPatternPathslength) {
            return true;
        }

        return false;  
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

    clearDocument = (): void =>  {
        this._patternPaths = new Array<PatternPath>();
        this._patternPathsTrash = [];
        this._pixelsPerInch = null;
        this._patternPieces = null;
        this._allowanceSizes = null;
    };

    emptyPatternPathsTrash = (): void => {
        this._patternPathsTrash = [];
    };

    // Precondition: arePatternPiecesEnclosed returned true 
    findPatternPieces = (): void => {
        const allowanceSizes = this._allowanceSizes;
        if (allowanceSizes === null) {
            throw new Error("The allowance sizes were not defined yet for this pattern");
        }
        
        const faces = FaceFinder.FindFaces(this._patternPaths);
        
        this._patternPieces = faces.map(face => (
            new PatternPiece(face, AllowanceFinder.computeAllowancePaths(face, allowanceSizes))
        ));

        // Temporary step to inspect pattern pieces and allowances on final review page while developping.
        this._patternPaths = this._spreadPatternPieces(this._patternPieces);
    };

    getAllowanceSize = (type: PatternPathType): number => {
        if (!this._allowanceSizes) {
            throw new Error("Allowance sizes were not set yet.");
        }
        const allowance = this._allowanceSizes.get(type);
        if (allowance === undefined) {
            throw new Error("Could not find allowance for this path type.");
        }
        return allowance;
    };

    getPatternPaths = (): PatternPath[] => {
        return [...this._patternPaths];
    };

    getPatternPathsTrash = (): IPatternPathTrash[] => {
        return [...this._patternPathsTrash];
    };

    getPatternPieces = (): PatternPiece[] | null => {
        return this._patternPieces;
    };

    getSizeRatio = (): number => {
        if (!this._pixelsPerInch) {
            console.log('error: the resizing ratio is not defined.');
            return -1;
        } 
        return this._pixelsPerInch;        
    };

    isEmpty = (): boolean => {
        return !this._patternPaths.length;
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

    /**
     * Sets the allowance sizes to 0 inches for folds, the input edgeAllowance 
     * for edges and the input seam allowance for seams. If parameters are
     * omitted, the edge allowance will be set to a default of 5/8 inch 
     * and the seam allowance to a default of 5/8 inch. The sizes are stored in
     * pixels in the allowanceSizes map data field.
     * 
     * Warning: every time this method is called the old data is erased.
     *
     * @param edgeAllowance 
     * @param seamAllowance 
     */
    setAllowanceSizes = (edgeAllowance?: number, seamAllowance?: number): void => {
        if (!this._pixelsPerInch) {
            throw new Error("The size ratio was not yet defined for this pattern.");
        }

        this._allowanceSizes = new Map();
        this._allowanceSizes.set(PatternPathType.Edge, (edgeAllowance || 0.625) * this._pixelsPerInch);
        this._allowanceSizes.set(PatternPathType.Fold, 0);
        this._allowanceSizes.set(PatternPathType.Seam, (seamAllowance || 0.625) * this._pixelsPerInch);
    };

    // Sets the pixels per inch ratio according to the input measurement.
    setSizeRatio = (inputMeasurementInInches: number, selectedPath: PatternPath): void => {
        // The size ratio is the # of pixels per inch.
        this._pixelsPerInch = selectedPath.getLengthInPixels() / inputMeasurementInInches;
    };

    /**
     * Method for debugging. Allows us to inspect pattern pieces an allowances visually.
     */ 
    private _spreadPatternPieces = (patternPieces: PatternPiece[]): PatternPath[] => {
        let result: PatternPath[] = [];

        for (let i = 0; i < patternPieces.length; i++) {
            patternPieces[i].translate(new Vector(50 * i, 0));
            result = result.concat(patternPieces[i].getAllPaths());
        }

        return result;
    };
}
import { PatternPath } from './PatternPath';

export class Document implements IDocument {
    private _patternPaths: PatternPath[];
    private _sizeRatio: null | number; // in pixels per inch

    constructor () {
        this._patternPaths = new Array<PatternPath>();
        this._sizeRatio = null;
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

    // Removes the most recently added Pattern Path
    removePatternPath = (): boolean => {
        if (!this._patternPaths.length) {
            throw new Error("Tried to remove path from document, but there are no paths to remove");
        }
        return Boolean(this._patternPaths.pop());
    }

    // Sets the pixels per inch ratio according to the input measurement
    setSizeRatio = (inputMeasurementInInches: number, selectedPath: PatternPath): void => {
        this._sizeRatio = selectedPath.getLengthInPixels() / inputMeasurementInInches;
    }

    getSizeRatio = (): number => {
        if (!this._sizeRatio) {
            console.log('error: the resizing ratio is not defined.');
            return -1;
        } 
        return this._sizeRatio;        
    }
}
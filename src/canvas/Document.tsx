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
    };

    arePatternPiecesEnclosed = (): boolean => {
        const endpoints = new Array(this._patternPaths.length * 2);

        this._patternPaths.forEach(path => {
            const points = path.getPoints();
            endpoints.push(points[0]);
            endpoints.push(points[points.length - 1]);
        });

        for(let i = 0; i < endpoints.length; i++) {
            const point = endpoints[i];
            if (!point) {
                continue;
            }

            let foundMatch = false;
            for (let j = i + 1; j < endpoints.length && !foundMatch; j++) {
                const o = endpoints[j];
                if(!o) {
                    continue;
                }

                if (point.equals(o)) {
                    foundMatch = true;
                    endpoints[j] = null;
                }
            }

            if (!foundMatch) {
                return false;
            }
        }

        return true;

    };

    isEmpty = (): boolean => {
        return Boolean(this._patternPaths.length);
    };

    // Sets the pixels per inch ratio according to the input measurement
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
}

// Todo move into seperate App class with Render
// pass in the document to the renderer
const globalDocument = new Document();

export { globalDocument };

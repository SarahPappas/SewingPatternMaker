import { PatternPath } from './PatternPath';
import { PatternPathType } from './PatternPathType';

export class Document implements IDocument {
    private _patternPaths: PatternPath[];
    private _patternPathType: {};

    constructor () {
        this._patternPaths = new Array<PatternPath> ();
        this._patternPathType = {
            Fold: new PatternPathType(PatternPathName.Fold, PatternPathColor.Green),
            Edge: new PatternPathType(PatternPathName.Edge, PatternPathColor.Yellow),
            Seam: new PatternPathType(PatternPathName.Seam, PatternPathColor.Blue)
        }
    }

    getPatternPaths = (): PatternPath[] => {
        return [...this._patternPaths];
    };

    addPatternPath = (patternPath: PatternPath): boolean => {
        let originalPatternPathslength = this._patternPaths.length;
        
        if (this._patternPaths.push(patternPath) > originalPatternPathslength) {
            return true;
        }

        return false;  
    };

    // Removes the most recently added Pattern Path
    removePatternPath = (): boolean => {
        return !!this._patternPaths.pop();
    }
}
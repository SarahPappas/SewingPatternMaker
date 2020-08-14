import { PatternPath } from "./PatternPaths/PatternPath";

export class PathSelection {
    private _selectedPath: PatternPath | null;
    private _highlightedPath: PatternPath | null;

    constructor() {
        this._selectedPath = null;
        this._highlightedPath = null;
    }

    getSelectedPath = (): PatternPath | null => {
        return this._selectedPath;
    };

    setSelectedPath = (path: PatternPath): void => {
        this._selectedPath = path;
    };

    getHighlightedPath = (): PatternPath | null => {
        return this._highlightedPath;
    };

    setHighlightedPath = (path: PatternPath | null): void => {
        this._highlightedPath = path;
    };
}
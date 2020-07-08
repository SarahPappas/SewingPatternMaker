/* COMPONENT TYPES */
type Button = {
    text: string;
    to: string;
};

type InstructModal = {
    text: string[];
}

/* CANVAS TYPES */
type IDocument = {
    getPatternPaths: () => PatternPath[];
    addPatternPath: (patternPath: PatternPath) => boolean;
    removePatternPath: () => boolean;
}

type IPatternPath = {
    getPoints: () => Point[];
    getType: () => PatternPathType;
    getPathCanvas2D: () => Path2D | null;
    addPoint: (point: Point) => Point[];
}

type IPatternPathType = {
    getColor: () => PatternPathColor;
    getName: () => PatternPathName;
}

type IPoint = {
    getX: () => number;
    getY: () => number;
};

type IRenderer = {
    init: () => HTMLCanvasElement;
}
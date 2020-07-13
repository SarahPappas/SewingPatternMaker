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
    getPath2D: () => Path2D;
    addPoint: (point: Point) => boolean;
}

type IPatternPathType = {
    getColor: () => PatternPathColor;
    getName: () => PatternPathName;
}

type IPoint = {
    getX: () => number;
    getY: () => number;
    equals: (o: Point) => boolean;
};

type IRenderer = {
    init: () => HTMLCanvasElement;
}
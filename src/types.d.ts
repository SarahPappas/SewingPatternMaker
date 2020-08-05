/* COMPONENT TYPES */
type NavButton = {
    label: string;
    to: string;
};

type ActionButton = {
    label: string;
    action: (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

type Button = {
    label: string;
    className: string;
};

type InstructModal = {
    text: string[];
}

type Input = {
    id: string;
    type: string;
    accept?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    fitCurve: () => void;
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
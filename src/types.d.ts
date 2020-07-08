/* COMPONENT TYPES */
type Button = {
    text: string;
    to: string;
};

type InstructModal = {
    text: string[];
}

/* CANVAS TYPES */
type Document = {
    private patternPaths: PatternPath[];

    getPatternPaths: () => PatternPath[];
    addPatternPath: (patternPath: PatternPath) => PatternPath[];
}

type PatternPathInterface = {
    private _points: Point[];
    private _type: PatternPathType;
    private _pathCanvas2D: Path2D | null;
    private _isPathCanvas2DInvalid: boolean;

    new (type: PatternPathType);
    getPoints: () => Point[];
    getType: () => PatternPathType;
    getPathCanvas2D: () => Path2D | null;
    addPoint: (point: Point) => Point[];
}

type PatternPathType = {
    private name: PatternPathName;
    private color: PatternPathColor;
}

type Point = {
    x: number;
    y: number;
};

type RendererInterface = {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D | null;
    private _document: Document;
    private _isTracing: boolean;

    new ();
    private _draw: () => void;
    init: () => HTMLCanvasElement;
    private _update: () => void;
    private _tick: () => void;
}
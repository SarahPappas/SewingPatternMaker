type Button = {
    text: string;
    to: string;
};

type Document = {
    paths: PatternPath[];
}

type InstructModal = {
    text: string[];
}

type PatternPath = {
    points: Point[];
    type: PatternPathType;
    
}

type PatternPathType = {
    name: PatternPathName;
    color: PatternPathColor;
}

type Point = {
    x: number;
    y: number;
};

type Renderer = {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _document: Document;
    private _isTracing: boolean;

    private _draw: () => void;
    init: () => HTMLCanvasElement;
    private _update: () => void;
    private _tick: () => void;
}
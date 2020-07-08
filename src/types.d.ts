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
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    document: Document;
    isTracing: boolean;

    draw: () => void;
    init: () => HTMLCanvasElement;
    update: () => void;
    tick: () => void;
}
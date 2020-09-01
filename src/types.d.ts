import { Segment } from "canvas/Geometry/Segment";

/* COMPONENT TYPES */
type Button = {
    label: string;
    className?: string;
};

type Modal = {
    text: string[];
    type: ModalType;
};

type Input = {
    id: string;
    type: string;
    accept?: string;
    onChange: ChangeEvent<HTMLInputElement>;
    className?: string;
};

/* CANVAS TYPES */
type IDocument = {
    getPatternPaths: () => PatternPath[];
    addPatternPath: (patternPath: PatternPath) => boolean;
    removePatternPath: () => boolean;
};

type IPatternPath = {
    getPoints: () => Point[];
    getType: () => PatternPathType;
    getPath2D: () => Path2D;
    getLengthInPixels: () => number;
    getSegment: () => Segment;
    splitAtPoint: (intersection: Point) => PatternPath[];
};

type IPatternPathType = {
    getColor: () => PatternPathColor;
    getName: () => PatternPathName;
};

type IPoint = {
    equals: (o: Point) => boolean;
};

type IRenderer = {
    init: () => HTMLCanvasElement;
};

type IIntersection = {
    point: Point; 
    pathCrossed: PatternPath;
};

type IPatternPathTrash = {
    path: PatternPath; 
    replacement: PatternPath[];
};
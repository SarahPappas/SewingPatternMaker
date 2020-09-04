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
    emptyPatternPathsTrash: () => void;
    getPatternPathsTrash: () => IPatternPathTrash[];
    removePatternPath: () => boolean;
    removeSpecificPatternPath: (path: PatternPath) => number;
    replacePatternPath: (pathToReplace: PatternPath, pathsToInsert: PatternPath[]) => void;
    arePatternPiecesEnclosed: () => boolean;
    isEmpty: () => boolean;
    setSizeRatio: (inputMeasurementInches: number, selectecPath: PatternPath) => void;
    prepPatternPieces: () => void;
};

type ITracingPath = {
    getPoints: () => Point[];
    getPath2D: () => Path2D;
    addPoint: (point: Point) => boolean;
    snapStartPoint: (paths: PatternPath[]) => boolean;
    snapStartPointTo: (point: Point) => void;
    snapEndPoint: (paths: PatternPath[]) => boolean;
};

type IPatternPath = {
    getPoints: () => Point[];
    getType: () => PatternPathType;
    getPath2D: () => Path2D;
    getLengthInPixels: () => number;
    getSegments: () => Segment[];
    splitAtPoint: (intersection: Point, segmentIndex: number) => PatternPath[];
};

type IPatternPathType = {
    getColor: () => PatternPathColor;
    getName: () => PatternPathName;
};

type IPoint = {
    equals: (o: Point) => boolean;
    isWithinRadius: (other: Point, radius: number) => boolean;
    distanceSquared: (other: Point) => number;
    distanceTo: (other: Point) => number;
    closestDistanceSquaredFromSetOfPoints: (points: Point[]) => number;
    toString: () => string;
    clone: () => Point;
};

type IVector = {
    norm: () => number;
    normalize: () => Vector;
    multiplyByScalar: (value: number) => Vector;
    getAngle: () => number;
};

type IRenderer = {
    init: () => HTMLCanvasElement;
    measurementInit: () => void;
    finalReviewInit: () => void;
};

type IIntersection = {
    point: Point; 
    pathCrossed: PatternPath;
    indexOfSegmentCrossed: number;
};

type IPatternPathTrash = {
    path: PatternPath; 
    replacement: PatternPath[];
};
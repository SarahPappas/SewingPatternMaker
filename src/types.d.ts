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
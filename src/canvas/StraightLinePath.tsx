import { PatternPath } from "./PatternPath";
import { PatternPathType, ToolType } from "./Enums";

export class StraightLinePath extends PatternPath {
    constructor (pathType: PatternPathType) {
        super(pathType, ToolType.StraightLine);
    }

    
}
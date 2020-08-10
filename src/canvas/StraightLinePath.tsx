import { PatternPath } from "./PatternPath";
import { PatternPathType, ToolType } from "./Enums";

export class StraightLinePath extends PatternPath {
    constructor (pathType: PatternPathType) {
        super(pathType, ToolType.StraightLine);
    }

    getLengthInPixels = (): number => {
        return Math.sqrt(this._points[0].distanceSquared(this._points[this._points.length - 1]));
    }

    protected _updatePath2D = (): void => {
        const firstPoint = this._points[0];
        const lastPoint = this._points[this._points.length -1];
        
        this._path2D = new Path2D();
        this._isPath2DValid = true;
        this._path2D.moveTo(firstPoint.getX(), firstPoint.getY());
        this._path2D.lineTo(lastPoint.getX(), lastPoint.getY());
    }

}
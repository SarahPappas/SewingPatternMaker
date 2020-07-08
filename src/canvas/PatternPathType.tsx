import { PatternPathName, PatternPathColor} from './Enums';

export class PatternPathType implements IPatternPathType {
    private _name: PatternPathName;
    private _color: PatternPathColor;

    constructor (name: PatternPathName, color: PatternPathColor) {
        this._name = name;
        this._color = color;
    }

    getColor = (): PatternPathColor => {
        return this._color;
    }

    getName = (): PatternPathName => {
        return this._name;
    }
}
import { Curve } from './Curve';
import { BezierCurve } from './BezierCurve';
import { Point } from './Point';

export class BestCurveSelector {
    private _bestCurve: Curve;
    private _bestCurveDelta: number;
    private _numPointsOnPotentialCurve: number;
    private _points: Point[];

    constructor(points: Point[], numPointsOnPotentialCurve: number) {
        this._bestCurve = new BezierCurve(new Point(0, 0), new Point(1, 0), new Point(1, 0));
        this._bestCurveDelta = Number.MAX_VALUE;
        this._numPointsOnPotentialCurve = numPointsOnPotentialCurve;
        this._points = points;
    }

    considerPotentialCurve = (potentialCurve: Curve): void => {
        const potentialCurvePoints = potentialCurve.computePoints(this._numPointsOnPotentialCurve);
        
        let curveDelta = 0;
        for (let i = 0; i < this._numPointsOnPotentialCurve; i++) {
            const delta = potentialCurvePoints[i].closestDistanceSquaredFromSetOfPoints(this._points);
            curveDelta += delta;
        }

        if (curveDelta < this._bestCurveDelta) {
            this._bestCurveDelta = curveDelta;
            this._bestCurve = potentialCurve;
        }
    };

    getBestCurve = (): Curve => {
        return this._bestCurve;
    };
}
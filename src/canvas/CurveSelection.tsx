import { Curve } from "./Curve";
import { BezierCurve } from "./BezierCurve";
import { Point } from "./Point";

export class CurveSelection{
    bestCurve: Curve;
    bestCurveDelta: number;
    numPointsOnPotentialCurve: number;
    points: Point[];

    constructor(points: Point[], numPointsOnPotentialCurve: number) {
        this.bestCurve = new BezierCurve(new Point(0, 0), new Point(1, 0), new Point(1, 0));
        this.bestCurveDelta = Number.MAX_VALUE;
        this.numPointsOnPotentialCurve = numPointsOnPotentialCurve;
        this.points = points;
    }

    evaluate = (potentialCurve: Curve): void => {
        const potentialCurvePoints = potentialCurve.computePointsOnCurve(this.numPointsOnPotentialCurve);
        
        let curveDelta = 0;
        for (let i = 0; i < this.numPointsOnPotentialCurve; i++) {
            const delta = potentialCurvePoints[i].closestDistanceSquaredFromSetOfPoints(this.points);
            curveDelta += delta;
        }

        if (curveDelta < this.bestCurveDelta) {
            this.bestCurveDelta = curveDelta;
            this.bestCurve = potentialCurve;
        }
    }
}
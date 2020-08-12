import { Point } from './Point';
import { Curve } from './Curve';
import { BoundingBox } from './BoundingBox';
import { BezierCurve } from './BezierCurve';
import { ArcCurve } from './ArcCurve';

export class CurveFitter {
    // The number of points on the potential curve that will be used to test the curve's fit.
    private static readonly numPointsOnPotentialcurve = 51;

    private _points: Point[];
    private _bestCurve: Curve;
    private _bestCurveDelta: number;
    private _startPoint: Point;
    private _endPoint: Point;

    constructor(points: Point[]) {
        // If there are two points or less, return void becuase this cannnot be fit to a curve.
        if (points.length <= 2) {
            throw new Error("not enough points");
        }
        this._points = points;
        this._startPoint = this._points[0];
        this._endPoint = this._points[this._points.length -1];
        this._bestCurveDelta = Number.MAX_VALUE;
        this._bestCurve = new BezierCurve(this._startPoint, this._endPoint, this._endPoint); 
    }

    fit = (): Curve => {
        // Check candidate bezier curves
        this._guessAndCheckPointsForBestBezierCurve();

        //also test circle arcs that curve from start to end
        this._guessAndCheckPointsForBestArcCurve();

        console.log(this._bestCurve instanceof ArcCurve ? "arc" : "bezier");
        return this._bestCurve;
    };

    private _guessAndCheckPointsForBestBezierCurve = (): void => {
        // Get the bounds of the drawing.
        const boundingBox = new BoundingBox(this._points);
        boundingBox.expand(2.5);

        // The number of samples taken on the x and y axis to test as a control point for the curve.
        const numSamples = 101;
        // test bezier curves with control points within the bounding box
        for (let y = 0; y < numSamples; y++) {
            const boundRelativeY = y / (numSamples - 1);
            const controlPointY = boundingBox.minY + boundingBox.height * boundRelativeY;
        
            for (let x = 0; x < numSamples; x++) {
                const boundRelativeX = x / (numSamples - 1);
                const controlPointX = boundingBox.minX + boundingBox.width * boundRelativeX;

                const curve = new BezierCurve(this._startPoint, this._endPoint, new Point(controlPointX, controlPointY));
                this._evaluatePotentialCurve(curve);
            }
        }
    };

    private _guessAndCheckPointsForBestArcCurve = (): void => {      
        for (let i = -500; i <= 500; i += 20) {
            // we avoid having control point aligned with startPoint and endPoint, 
            // since that would yield a degenerate curve (a line)
            if (i === 0) { 
                continue;
            }
            
            const controlPoint = Point.getPointOnMidline(this._startPoint, this._endPoint, i);
            const curve = new ArcCurve(this._startPoint, this._endPoint, controlPoint);
            this._evaluatePotentialCurve(curve);
        }
    };

    private _evaluatePotentialCurve = (curve: Curve): void => {
        const potentialCurvePoints = curve.computePointsOnCurve(CurveFitter.numPointsOnPotentialcurve);
        
        let curveDelta = 0;
        for (let i = 0; i < CurveFitter.numPointsOnPotentialcurve; i++) {
            const delta = potentialCurvePoints[i].closestDistanceSquaredFromSetOfPoints(this._points);
            curveDelta += delta;
        }

        if (curveDelta < this._bestCurveDelta) {
            this._bestCurveDelta = curveDelta;
            this._bestCurve = curve;
        }
    }
}


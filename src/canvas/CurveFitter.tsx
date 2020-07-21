import { Point } from './Point';
import { Curve } from './Curve';

export class CurveFitter {
    private _points: Point[];
    
    constructor (points: Point[]) {
        this._points = points;
    }

    Fit = (): Curve | void => {
        // If there are two points or less, return void becuase this cannnot be fit to a curve.
        if (this._points.length >= 2) {
            return;
        }

        let startPoint = this._points[0];
        let endPoint = this._points[this._points.length -1];

        // Set the bounds we will look in for the control point.
        let controlPointBoundMinX = this._points[0].getX();
        let controlPointBoundMaxX = this._points[0].getX();
        let controlPointBoundMinY = this._points[0].getY();
        let controlPointBoundMaxY = this._points[0].getY();

        this._points.forEach(point => {
            let x = point.getX();
            let y = point.getY();
            if(x < controlPointBoundMinX) {
                controlPointBoundMinX = x;
            } else {
                controlPointBoundMaxX = x;
            }

            if(y < controlPointBoundMinY) {
                controlPointBoundMinY = y;
            } else {
                controlPointBoundMaxY = y;
            }
        });

        let controlPointBoundHeight = controlPointBoundMaxY - controlPointBoundMinY;
        let controlPointBoundWidth = controlPointBoundMaxX - controlPointBoundMinX;

        // Test each control point searching for the best fit.
        // let potentialCurves = new Array<Curve>();
        const numSamples = 20;
        let bestCurveDelta: number = 10000;
        let bestCurve= new Curve(startPoint, endPoint, endPoint); 

        for (let y = 0; y < numSamples; y++) {
            let boundRelativeY = y / numSamples - 1;
            let controlPointY = controlPointBoundMinY + controlPointBoundHeight * boundRelativeY;
        
            for (let x = 0; x < numSamples; x++) {
                let boundRelativeX = x / numSamples - 1;
                let controlPointX = controlPointBoundMinX + controlPointBoundWidth * boundRelativeX;
        
                // let potentialCurvesIndex = y * numSamples + x;
                const curve = new Curve(startPoint, endPoint, new Point(controlPointX, controlPointY));
                // potentialCurves[potentialCurvesIndex] = curve;

        
                let potentialCurvePoints = curve.computePointsOnCurve(numSamples);
  
                for (let i = 0; i < numSamples; i++) {
                    let delta = this.sumDistanceSquared(potentialCurvePoints[i]);
                    if (delta < bestCurveDelta) {
                        delta = bestCurveDelta;
                        bestCurve = curve;
                    }
                }
            }
        }

        return bestCurve;


    };

    private sumDistanceSquared = (point: Point): number => {
        let sum = 0;
        for (let i = 0; i < this._points.length; i++) {
            let dx = point.getX() - this._points[i].getX();
            let dy = point.getY() - this._points[i].getX();;
            sum += dx * dx + dy * dy;

        }
        return sum;
    };

    
}


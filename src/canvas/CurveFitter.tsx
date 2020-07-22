import { Point } from './Point';
import { Curve } from './Curve';

export class CurveFitter {
    private _points: Point[];
    
    constructor (points: Point[]) {
        this._points = points;
    }

    Fit = (): Curve => {
        // If there are two points or less, return void becuase this cannnot be fit to a curve.
        if (this._points.length <= 2) {
            throw new Error("not enough points");
        }

        const startPoint = this._points[0];
        const endPoint = this._points[this._points.length -1];

        // Set the bounds of the drawing.
        let controlPointBoundMinX = this._points[0].getX();
        let controlPointBoundMaxX = this._points[0].getX();
        let controlPointBoundMinY = this._points[0].getY();
        let controlPointBoundMaxY = this._points[0].getY();

        this._points.forEach(point => {
            const x = point.getX();
            const y = point.getY();
            if (x < controlPointBoundMinX) {
                controlPointBoundMinX = x;
            } else if (x > controlPointBoundMaxX) {
                controlPointBoundMaxX = x;
            }

            if (y < controlPointBoundMinY) {
                controlPointBoundMinY = y;
            } else if (y > controlPointBoundMaxY) {
                controlPointBoundMaxY = y;
            }
        });

        let controlPointBoundHeight = controlPointBoundMaxY - controlPointBoundMinY;
        let controlPointBoundWidth = controlPointBoundMaxX - controlPointBoundMinX;

        // Expand bounds of box of where we will search for a control point.
        const boundCenterX = controlPointBoundWidth/2 + controlPointBoundMinX;
        const boundCenterY = controlPointBoundHeight/2 + controlPointBoundMinY;

        controlPointBoundMinX = boundCenterX + 2.5 * (controlPointBoundMinX - boundCenterX );
        controlPointBoundMinY = boundCenterY + 2.5 * (controlPointBoundMinY - boundCenterY );
        controlPointBoundHeight = controlPointBoundHeight * 2.5;
        controlPointBoundWidth = controlPointBoundWidth * 2.5;

        // Test each control point searching for the best fit.
        const numSamples = 101;
        const numPointsOnPotentialcurve = 51;
        let bestCurveDelta = Number.MAX_VALUE;
        let bestCurve = new Curve(startPoint, endPoint, endPoint); 

        for (let y = 0; y < numSamples; y++) {
            const boundRelativeY = y / (numSamples - 1);
            const controlPointY = controlPointBoundMinY + controlPointBoundHeight * boundRelativeY;
        
            for (let x = 0; x < numSamples; x++) {
                const boundRelativeX = x / (numSamples - 1);
                const controlPointX = controlPointBoundMinX + controlPointBoundWidth * boundRelativeX;
        
                const curve = new Curve(startPoint, endPoint, new Point(controlPointX, controlPointY));
        
                const potentialCurvePoints = curve.computePointsOnCurve(numPointsOnPotentialcurve);

                let maxDelta = 0;
                for (let i = 0;i < numPointsOnPotentialcurve;i++) {
                    const delta = this.closestDistanceSquared(potentialCurvePoints[i], this._points);
                    if (delta > maxDelta) {
                        maxDelta = delta; 
                    }
                }

                if (maxDelta < bestCurveDelta) {
                    bestCurveDelta = maxDelta;
                    bestCurve = curve;
                }

            }
        }

        return bestCurve;
    };

    private closestDistanceSquared = (point: Point, points: Point[]): number => {
        let minDistance = Number.MAX_VALUE;


        for (let i = 0;i < points.length;i++) {
            const distance = point.distanceSquared(points[i]);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        return minDistance;
    }
}


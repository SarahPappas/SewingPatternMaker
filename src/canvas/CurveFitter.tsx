import { Point } from './Point';
import { Curve } from './Curve';
import { BoundingBox } from './BoundingBox';

export class CurveFitter {

    static Fit = (points: Point[]): Curve => {
        // If there are two points or less, return void becuase this cannnot be fit to a curve.
        if (points.length <= 2) {
            throw new Error("not enough points");
        }

        const startPoint = points[0];
        const endPoint = points[points.length -1];

        // Get the bounds of the drawing.
        const boundingBox = new BoundingBox(points);
        const expandedBox = boundingBox.expand();

        // Test each control point searching for the best fit.
        const numSamples = 101;
        const numPointsOnPotentialcurve = 51;
        let bestCurveDelta = Number.MAX_VALUE;
        let bestCurve = new Curve(startPoint, endPoint, endPoint); 

        for (let y = 0; y < numSamples; y++) {
            const boundRelativeY = y / (numSamples - 1);
            const controlPointY = expandedBox.minY + expandedBox.height * boundRelativeY;
        
            for (let x = 0; x < numSamples; x++) {
                const boundRelativeX = x / (numSamples - 1);
                const controlPointX = expandedBox.minY + expandedBox.width * boundRelativeX;
        
                const curve = new Curve(startPoint, endPoint, new Point(controlPointX, controlPointY));
        
                const potentialCurvePoints = curve.computePointsOnCurve(numPointsOnPotentialcurve);

                let maxDelta = 0;
                for (let i = 0;i < numPointsOnPotentialcurve;i++) {
                    const delta = potentialCurvePoints[i].closestDistanceSquaredFromSetOfPoints(points);
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
}


import { Point } from './Point';
import { Curve } from './Curve';
import { BoundingBox } from './BoundingBox';

export class CurveFitter {

    static Fit = (points: Point[]): Curve => {
        // If there are two points or less, return void becuase this cannnot be fit to a curve.
        if (points.length <= 2) {
            throw new Error("not enough points");
        }
        
        // Get the bounds of the drawing.
        const boundingBox = new BoundingBox(points);
        boundingBox.expand(2.5);

        // The number of samples taken on the x and y axis to test as a control point for the curve.
        const numSamples = 101;
        
        // Find the best curve in the bounds. 
        return CurveFitter.guessAndCheckPointsInBoundsForBestCurve(points, numSamples, boundingBox);
    };

    private static guessAndCheckPointsInBoundsForBestCurve = (points: Point[], numSamples: number, boundingBox: BoundingBox): Curve => {
        const startPoint = points[0];
        const endPoint = points[points.length -1];

        let bestCurveDelta = Number.MAX_VALUE;
        let bestCurve = new Curve(startPoint, endPoint, endPoint); 

        for (let y = 0; y < numSamples; y++) {
            const boundRelativeY = y / (numSamples - 1);
            const controlPointY = boundingBox.minY + boundingBox.height * boundRelativeY;
        
            for (let x = 0; x < numSamples; x++) {
                const boundRelativeX = x / (numSamples - 1);
                const controlPointX = boundingBox.minX + boundingBox.width * boundRelativeX;
        
                const curve = new Curve(startPoint, endPoint, new Point(controlPointX, controlPointY));
        
                // The number of points on the potential curve that will be used to test the curve's fit.
                const numPointsOnPotentialcurve = 51;
                const potentialCurvePoints = curve.computePointsOnCurve(numPointsOnPotentialcurve);

                let maxDelta = 0;
                for (let i = 0; i < numPointsOnPotentialcurve; i++) {
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


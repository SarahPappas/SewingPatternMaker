import { Point } from './Point';
import { Curve } from './Curve';
import { BoundingBox } from './BoundingBox';
import { CurveType } from './Enums';

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

        // The number of points on the potential curve that will be used to test the curve's fit.
        const numPointsOnPotentialcurve = 51;

        let bestCurveDelta = Number.MAX_VALUE;
        let bestCurve = new Curve(startPoint, endPoint, endPoint, CurveType.Bezier); 

        for (let y = 0; y < numSamples; y++) {
            const boundRelativeY = y / (numSamples - 1);
            const controlPointY = boundingBox.minY + boundingBox.height * boundRelativeY;
        
            for (let x = 0; x < numSamples; x++) {
                const boundRelativeX = x / (numSamples - 1);
                const controlPointX = boundingBox.minX + boundingBox.width * boundRelativeX;
        
                const curve = new Curve(startPoint, endPoint, new Point(controlPointX, controlPointY), CurveType.Bezier);
                const potentialCurvePoints = curve.computePointsOnCurve(numPointsOnPotentialcurve);

                let curveDelta = 0;
                for (let i = 0; i < numPointsOnPotentialcurve; i++) {
                    const delta = potentialCurvePoints[i].closestDistanceSquaredFromSetOfPoints(points);
                    curveDelta += delta;
                }

                if (curveDelta < bestCurveDelta) {
                    bestCurveDelta = curveDelta;
                    bestCurve = curve;
                }

            }
        }

        console.log('start: ' + startPoint.getX() + ', ' + startPoint.getY());
        console.log('end: ' + endPoint.getX() + ', ' + endPoint.getY());
        //also test arc curves
        for (let i = -500; i <= 500; i += 100) {
            const controlPoint = startPoint.getPointOnMidline(endPoint, i);
            const curve = new Curve(startPoint, endPoint, controlPoint, CurveType.Arc);
            //console.log('control: ' + controlPoint.getX() + ', ' + controlPoint.getY());
            const potentialCurvePoints = curve.computePointsOnCurve(numPointsOnPotentialcurve);

            let curveDelta = 0;
            for (let i = 0; i < numPointsOnPotentialcurve; i++) {
                const delta = potentialCurvePoints[i].closestDistanceSquaredFromSetOfPoints(points);
                curveDelta += delta;
            }

            if (curveDelta < bestCurveDelta) {
                bestCurveDelta = curveDelta;
                bestCurve = curve;
            }

        }

        return bestCurve;
    }
}


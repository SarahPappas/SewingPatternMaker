import { Point } from './Point';
import { Curve } from './Curve';
import { BoundingBox } from './BoundingBox';
import { BezierCurve } from './BezierCurve';
import { ArcCurve } from './ArcCurve';

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
        let bestCurve: Curve = new BezierCurve(startPoint, endPoint, endPoint); 

        // test bezier curves with control points within the bounding box
        for (let y = 0; y < numSamples; y++) {
            const boundRelativeY = y / (numSamples - 1);
            const controlPointY = boundingBox.minY + boundingBox.height * boundRelativeY;
        
            for (let x = 0; x < numSamples; x++) {
                const boundRelativeX = x / (numSamples - 1);
                const controlPointX = boundingBox.minX + boundingBox.width * boundRelativeX;
        
                const curve = new BezierCurve(startPoint, endPoint, new Point(controlPointX, controlPointY));
                const potentialCurvePoints = curve.computePointsOnCurve(numPointsOnPotentialcurve);

                //TODO: factor this duplicated code
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

        //also test circle arcs that curve from start to end
        for (let i = -500; i <= 500 && i !== 0; i += 20) {
            // we avoid having control point aligned with startPoint and endPoint, 
            // since that would yield a degenerate curve (a line)
            const controlPoint = Point.getPointOnMidline(startPoint, endPoint, i);
            const curve = new ArcCurve(startPoint, endPoint, controlPoint);
            const potentialCurvePoints = curve.computePointsOnCurve(numPointsOnPotentialcurve);

            //TODO: factor this duplicated code
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

        console.log(bestCurve instanceof ArcCurve ? "arc" : "bezier");
        return bestCurve;
    };
}


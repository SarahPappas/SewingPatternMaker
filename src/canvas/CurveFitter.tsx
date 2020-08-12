import { Point } from './Point';
import { Curve } from './Curve';
import { BoundingBox } from './BoundingBox';
import { BezierCurve } from './BezierCurve';
import { ArcCurve } from './ArcCurve';
import { CurveSelection } from './CurveSelection';

export class CurveFitter {
    // The number of points on the potential curve that will be used to test the curve's fit.
    private static readonly numPointsOnPotentialcurve = 51;

    static fit = (points: Point[]): Curve => {
        // If there are two points or less, return void becuase this cannnot be fit to a curve.
        if (points.length <= 2) {
            throw new Error("not enough points");
        }

        const curveSelection = new CurveSelection(points, CurveFitter.numPointsOnPotentialcurve);

        // Check candidate bezier curves
        CurveFitter._guessAndCheckPointsForBestBezierCurve(points, curveSelection);

        //also test circle arcs that curve from start to end
        CurveFitter._guessAndCheckPointsForBestArcCurve(points, curveSelection);

        console.log(curveSelection.bestCurve instanceof ArcCurve ? "arc" : "bezier");
        return curveSelection.bestCurve;
    };

    private static _guessAndCheckPointsForBestBezierCurve = (points: Point[], curveSelection: CurveSelection): void => {
        const startPoint = points[0];
        const endPoint = points[points.length -1];
        
        // Get the bounds of the drawing.
        const boundingBox = new BoundingBox(points);
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

                const curve = new BezierCurve(startPoint, endPoint, new Point(controlPointX, controlPointY));
                curveSelection.evaluate(curve);
            }
        }
    };

    private static _guessAndCheckPointsForBestArcCurve = (points: Point[], curveSelection: CurveSelection): void => {      
        const startPoint = points[0];
        const endPoint = points[points.length -1];
        
        for (let i = -500; i <= 500; i += 10) {
            // we avoid having control point aligned with startPoint and endPoint, 
            // since that would yield a degenerate curve (a line)
            if (i === 0) { 
                continue;
            }
            
            const controlPoint = Point.getPointOnMidline(startPoint, endPoint, i);
            const curve = new ArcCurve(startPoint, endPoint, controlPoint);
            curveSelection.evaluate(curve);
        }
    };
}


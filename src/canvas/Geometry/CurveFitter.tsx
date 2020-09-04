import { Point } from './Point';
import { BoundingBox } from './BoundingBox';
import { BezierCurve } from './BezierCurve';
import { ArcCurve } from './ArcCurve';
import { BestCurveSelector } from './BestCurveSelector';
import { Segment } from './Segment';

export class CurveFitter {
    static Fit = (points: Point[]): Segment => {
        // If there are less than two points, we cannot fit any curve.
        if (points.length < 3) {
            throw new Error("not enough points");
        }

        const startPoint = points[0];
        const endPoint = points[points.length - 1];
        const curveSelector = new BestCurveSelector(points);
                
        // Check candidate bezier curves by exploring control points inside a bounding box around the points.
        const boundingBox = new BoundingBox(points);
        boundingBox.expand(2.5);
        CurveFitter.guessAndCheckControlPointsForBestBezierCurve(startPoint, endPoint, boundingBox, curveSelector);

        // Check candidate circle arcs that curve from start to end.
        CurveFitter.guessAndCheckControlPointsForBestArcCurve(startPoint, endPoint, curveSelector);

        return curveSelector.getBestCurve();
    };

    private static guessAndCheckControlPointsForBestBezierCurve = (startPoint: Point, endPoint: Point, boundingBox: BoundingBox, curveSelector: BestCurveSelector): void => {
        // The number of samples taken on the x and y axis to test as a control point for the curve.
        // TODO: determine this number according to the size of the box
        const numSamples = 101;

        // Test bezier curves with control points within the bounding box.
        for (let y = 0; y < numSamples; y++) {
            const boundRelativeY = y / (numSamples - 1);
            const controlPointY = boundingBox.minY + boundingBox.height * boundRelativeY;
        
            for (let x = 0; x < numSamples; x++) {
                const boundRelativeX = x / (numSamples - 1);
                const controlPointX = boundingBox.minX + boundingBox.width * boundRelativeX;

                const curve = new BezierCurve(startPoint, endPoint, new Point(controlPointX, controlPointY));
                curveSelector.considerPotentialCurve(curve);
            }
        }
    };

    private static guessAndCheckControlPointsForBestArcCurve = (startPoint: Point, endPoint: Point, curveSelector: BestCurveSelector): void => {      
        // Test arc curves with control points along the midline between start and end.
        for (let i = -500; i <= 500; i += 10) {
            // If i = 0, getPointOnMidline will return the middle point between start and end
            // We need to avoid having control point aligned with startPoint and endPoint, 
            // since that would violate the preconditions of the ArcCurve constructor.
            if (i === 0) { 
                continue;
            }
            
            const controlPoint = Point.getPointOnMidline(startPoint, endPoint, i);
            const curve = new ArcCurve(startPoint, endPoint, controlPoint);
            curveSelector.considerPotentialCurve(curve);
        }
    };
}


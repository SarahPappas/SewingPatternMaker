import { Point } from './Point';
import { Curve } from './Curve';
import { Direction } from './Enums';

export class CurveFitter {
    private _points: Point[];
    private _splitsIndex: number[];
    
    constructor (points: Point[]) {
        this._points = points;
        this._splitsIndex = new Array<number>();
    }

    Fit = (points: Point[]): Curve => {
        // If there are two points or less, return void becuase this cannnot be fit to a curve.
        if (points.length <= 2) {
            throw new Error("not enough points");
        }

        const startPoint = points[0];
        const endPoint = points[points.length -1];

        // Set the bounds of the drawing.
        let controlPointBoundMinX = points[0].getX();
        let controlPointBoundMaxX = points[0].getX();
        let controlPointBoundMinY = points[0].getY();
        let controlPointBoundMaxY = points[0].getY();

        points.forEach(point => {
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
                    const delta = this.closestDistanceSquared(potentialCurvePoints[i], points);
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

    private splitPathBySlope = (points: Point[]): void => {
        if (points.length < 3) {
            return;
        }

        let startIndex = 0;
        let prevSlope = this.getSlope(points[startIndex], points[1]);
        let nextSlope;
        let direction = Direction.UNDEFINED;
        const SLOPE_THRESHOLD = 1;
        const INDEX_THRESHOLD = 3;

        // Use every other point to calculate slope
        for (let i = 1; i < points.length - 5; i++) {
            nextSlope = this.getSlope(points[startIndex], points[i]);

            // If either the previous slope or the next slope is infiinty, skip this iteration of the loop.
            if (prevSlope === Infinity) {
                prevSlope = nextSlope;
                continue;
            }

            if (nextSlope === Infinity) {
                continue;
            }

            // If the direction is the the slope is moving is not defined, set the direction.
            if (!direction) {
                if (prevSlope - nextSlope > 0) {
                    direction = Direction.Decrease;
                } else if (prevSlope - nextSlope < 0) {
                    direction = Direction.Increase;
                }
            }

            switch (direction) {
                case Direction.Increase: 
                    /* If the difference in slope is greater than the slope threshold and there are not splits yet, add a split. 
                     * Otherwise, if the difference in slope is greater than the slope threshold and the difference in index is 
                     * greater than the index threshold, add the split.
                     */
                    if ((prevSlope - nextSlope > SLOPE_THRESHOLD && !this._splitsIndex.length) 
                        || (prevSlope - nextSlope > SLOPE_THRESHOLD && i - this._splitsIndex[this._splitsIndex.length - 1] > INDEX_THRESHOLD)) {
                        this._splitsIndex.push(i);
                        // Set the start index to the current index.
                        startIndex = i;
                        // Reset the direction/
                        direction = Direction.UNDEFINED;
                    }
                    break;
                case Direction.Decrease:
                    /* If the difference in slope is less than the slope threshold and there are not splits yet, add a split. 
                     * Otherwise, if the difference in slope is less than the slope threshold and the difference in index is 
                     * greater than the index threshold, add the split.
                     */
                    if ((prevSlope - nextSlope < -SLOPE_THRESHOLD  && !this._splitsIndex.length) 
                        || (prevSlope - nextSlope < -SLOPE_THRESHOLD && i - this._splitsIndex[this._splitsIndex.length - 1] > INDEX_THRESHOLD)) {
                        this._splitsIndex.push(i);
                        // Set the start index to the current index.
                        startIndex =  i;
                        // Reset the direction.
                        direction = Direction.UNDEFINED;
                    }
                    break;
            }

            prevSlope = nextSlope;
        }
    }

    private getSlope = (pointA: Point, pointB: Point): number => {
        return (pointA.getY() - pointB.getY()) /(pointA.getX() - pointB.getX());
    }

    FitLine = (): Curve[] => {
        const curves = new Array<Curve>();
        // Spit the original set of points.
        this.splitPathBySlope(this._points);

        // If the line is not split, fit all the points to a curve
        if (!this._splitsIndex.length) {
            curves.push(this.Fit(this._points));
            return curves;
        }

        // If the line is split, fit each segement with a curve.
        let lastCurveIndex = 0;
        for (let i = 0; i < this._splitsIndex.length; i++) {
            curves.push(this.Fit(this._points.slice(lastCurveIndex, this._splitsIndex[i])));
            lastCurveIndex = this._splitsIndex[i];
        }
        curves.push(this.Fit(this._points.slice(lastCurveIndex, this._points.length -1)));

        return curves;
    }
}


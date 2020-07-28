import { Point } from './Point';
import { Curve } from './Curve';

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

    private splitPath = (points: Point[]): void => {
        if (points.length < 3) {
            return;
        }

        let startIndex = 0;
        let prevSlope = this.getSlope(points[startIndex], points[1]);
        let nextSlope = null;
        let direction = null;

        for (let i = 2; i < points.length - 5; i+=2) {
            nextSlope = this.getSlope(points[startIndex], points[i]);

            if (prevSlope === Infinity) {
                prevSlope = nextSlope;
                continue;
            }

            if (nextSlope === Infinity) {
                continue;
            }

            if (!direction) {
                if (prevSlope - nextSlope > 0) {
                    direction = 'decrease';
                } else if (prevSlope - nextSlope < 0) {
                    direction = 'increase';
                } else {
                    direction = null;
                }
            }

            switch (direction) {
                case 'increase': 
                    if ((prevSlope - nextSlope > 3 && !this._splitsIndex.length) || prevSlope - nextSlope > 0 && i - this._splitsIndex[this._splitsIndex.length - 1] > 3) {
                        this._splitsIndex.push(i);
                        startIndex = i;
                        direction = null;
                    }
                    break;
                case 'decrease':
                    if ((prevSlope - nextSlope < -3  && !this._splitsIndex.length) || prevSlope - nextSlope < 0 && i - this._splitsIndex[this._splitsIndex.length - 1] > 3) {
                        this._splitsIndex.push(i);
                        startIndex =  i;
                        direction = null;
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
        this.splitPath(this._points);

        if (!this._splitsIndex.length) {
            curves.push(this.Fit(this._points));
            return curves;
        }

        let lastCurveIndex = 0;
        for (let i = 0; i < this._splitsIndex.length; i++) {
            curves.push(this.Fit(this._points.slice(lastCurveIndex, this._splitsIndex[i])));
            lastCurveIndex = this._splitsIndex[i];
        }

        return curves;
    }
}


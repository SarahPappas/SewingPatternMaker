import { PatternPath } from './PatternPaths/PatternPath';
import { Document } from './Document';
import { PathSelection } from './PathSelection';
import { Point } from './Geometry/Point';
import { PatternPathColor } from './PatternPaths/PatternPathColor';
import { PatternPathType, ToolType } from './Enums';
import { StraightLinePath } from './PatternPaths/StraightLinePath';
import { FreeLinePath } from './PatternPaths/FreeLinePath';
import { Line } from './Geometry/Line';

export class Renderer implements IRenderer {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _document: Document;
    private _isTracing: boolean;
    private _currPath: PatternPath | null;
    private _pathType: PatternPathType;
    private _toolType: ToolType;
    private _pathSelection: PathSelection;

    constructor (documentModel: Document, pathSelectionModel: PathSelection) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = 300;
        this._canvas.height = 400;

        const contextOrNull = this._canvas.getContext('2d');
        if (!contextOrNull) {
            throw new Error("Could not create 2D context for canvas.");
        }

        this._context = contextOrNull;
        this._document = documentModel;
        this._isTracing = false;
        this._currPath = null;
        this._pathType = PatternPathType.UNDEFINED;
        // The default tool type is a straight line tool.
        this._toolType = ToolType.StraightLine;
        this._pathSelection = pathSelectionModel;
    }

    init = (): HTMLCanvasElement => {
        this._tick();

        this._canvas.onmousedown = (e) => {
            if (!this._pathType) {
                throw new Error("Path type not set");
            }

            this._isTracing = true;
            
            switch(this._toolType) {
                case(ToolType.StraightLine):
                    this._currPath = new StraightLinePath(this._pathType);
                    break;
                case(ToolType.Freeline):
                    this._currPath = new FreeLinePath(this._pathType);
                    break;
            }

            this._document.addPatternPath(this._currPath);
            this._currPath.addPoint(new Point(e.offsetX, e.offsetY));
        };

        this._canvas.onmousemove = (e) => {
            if (this._isTracing && this._currPath) {
                const position = new Point(e.offsetX, e.offsetY);
                const intersection = this._findIntersection(position);
                if (intersection) {
                    this._isTracing = false;
                    this._endTracing(intersection);
                } else {
                    this._currPath.addPoint(position);
                }
            }
        };
        
        this._canvas.onmouseup = (e) => {
            const position = new Point(e.offsetX, e.offsetY);
            if (this._isTracing) {
                // Moved this._isTracing = false out of _resetTracing beecause onmouseup and onmouseout are both fired.
                // This means that _endTracing was called multiple times.
                this._isTracing = false;
                this._endTracing(position);
            }
        };

        // If the user draws off the canvas, we will stop adding to the path.
        this._canvas.onmouseout = (e) => {
            const position = new Point(e.offsetX, e.offsetY);
            if(this._isTracing) {
                this._isTracing = false;
                this._endTracing(position);
            }
        };

        this._canvas.addEventListener('setPathType', ((e: CustomEvent) => {
            this._setPathType(e.detail.pathType);
        }) as EventListener);

        this._canvas.addEventListener('setToolType', ((e: CustomEvent) => {
            this._setToolType(e.detail.toolType);
        }) as EventListener);

        this._canvas.addEventListener('removePath', ((e) => {
            this._document.removePatternPath();
        }) as EventListener);

        return this._canvas;
    };

    measurementInit = (): void  => {
        const patternPaths = this._document.getPatternPaths();
        
        this._canvas.onmousedown = (e) => {
            for (let i = 0; i < patternPaths.length; i++) {
                if (this._context.isPointInStroke(patternPaths[i].getPath2D(), e.offsetX, e.offsetY)) {
                    this._pathSelection.setSelectedPath(patternPaths[i]);
                    break;
                }
            }
        };

        this._canvas.onmousemove = (e) => {
            this._pathSelection.setHighlightedPath(null);
            for (let i = 0; i < patternPaths.length; i++) {
                if (this._context.isPointInStroke(patternPaths[i].getPath2D(), e.offsetX, e.offsetY)) {
                    this._pathSelection.setHighlightedPath(patternPaths[i]);
                    break;
                }
            }
        };

        this._canvas.onmouseup = null;
        this._canvas.onmouseout = null;
    };

    private _draw = (): void => {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    
        this._drawPatternPaths();
    };

    private _drawPatternPaths = (): void => {
        const context = this._context;
        context.lineWidth = 5;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        
        const paths = this._document.getPatternPaths();
        paths.forEach(path => {
            const path2D = path.getPath2D();
            let pathColor: string | undefined;
            if (path === this._pathSelection.getSelectedPath() || path === this._pathSelection.getHighlightedPath()){
                pathColor = PatternPathColor.get("Selected");
            } else {
                pathColor = PatternPathColor.get(path.getType());
            }
            
            if (!pathColor) {
                throw new Error("Could not get path color for " + path.getType().toString());
            }

            // The color set before stroke will be the color used by the context to stroke the path.
            context.strokeStyle = pathColor;
            context.stroke(path2D);
        });
    };

    private _endTracing = (position: Point): void => {
        if (this._currPath) {
            this._currPath.addPoint(position);
            this._currPath.snapEndpoints(this._document.getPatternPaths());
            this._currPath.setFittedSegment();

            this._canvas.dispatchEvent(new Event('endTracing'));     
        }
        this._resetTracing();
    };

    // Precondition: Call before current point is added.
    private _findIntersection = (point: Point): Point | null => {
        const numPointsInCurrPath = this._currPath?.getPoints().length;
        if (!this._currPath || !numPointsInCurrPath) {
            return null;
        }
        
        const patternPaths = this._document.getPatternPaths();
        // The line segment where we are are searching for interesection should be a line between the current point and last point added.
        let prevPtIndex = numPointsInCurrPath - 1;
        // Keep this, because sometimes onMouseMove has already added this point
        while(prevPtIndex >= 0 && this._currPath.getPoints()[prevPtIndex].equals(point)) {
            prevPtIndex--;
        }

        if (prevPtIndex < 0) {
            return null;
        }

        const thisLineSeg = new Line(this._currPath.getPoints()[prevPtIndex], point);
        
        for (let i = 0; i < patternPaths.length; i++) {
            const comparisonPath = patternPaths[i];
            const comparisonPts = comparisonPath.getPoints();
            const cpStartPt = comparisonPts[0];
            const cpEndPt = comparisonPts[comparisonPts.length - 1];
            // If the current path is the path this iteration, do not look for interstection.
            if (patternPaths[i] !== this._currPath 
                // TODO if with in radius of endpoints, snap.
                && !point.isWithinRadius(cpStartPt, 10) 
                && !point.isWithinRadius(cpEndPt, 10)) {
               
                for (let j = 1; j < comparisonPts.length; j+=5 ) {
                    const otherLineSeg = new Line(comparisonPts[j], comparisonPts[j - 1]);
                    const intersectionPoint = thisLineSeg.findIntersectionPoint(otherLineSeg);
                    if (intersectionPoint) {
                        // eslint-disable-next-line no-debugger
                        console.log("possible instersection found", intersectionPoint);

                        console.log("is intersection on thisline?", thisLineSeg.isPointOnLine(intersectionPoint, .1));
                        console.log("is intersection on otherline?", otherLineSeg.isPointOnLine(intersectionPoint, .1));
                    }
                    if (intersectionPoint 
                        && thisLineSeg.isPointOnLine(intersectionPoint, .1)
                        && otherLineSeg.isPointOnLine(intersectionPoint, .1)) {
                        return intersectionPoint;
                    }
                }
            } 
        }

        return null;
    }

    private _resetTracing = (): void => {
        this._currPath = null;
        this._toolType = ToolType.StraightLine;
    };

    private _setPathType = (type: number): void => {
        this._pathType = type;
    };

    private _setToolType = (type: number): void => {
        this._toolType = type;
    };

    private _tick = (): void => {
        // this._update();
        this._draw();
    
        requestAnimationFrame(this._tick);
    };

    // private _update = (): void => {
    //     console.log("update");
    // }

}

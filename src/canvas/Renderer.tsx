import { PatternPath } from './PatternPaths/PatternPath';
import { Document } from './Document';
import { PathSelection } from './PathSelection';
import { Point } from './Geometry/Point';
import { PatternPathColor } from './PatternPaths/PatternPathColor';
import { PatternPathType, ToolType } from './Enums';
import { StraightLinePath } from './PatternPaths/StraightLinePath';
import { FreeLinePath } from './PatternPaths/FreeLinePath';
import { PathIntersection } from './PathIntersection';

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
                this._currPath.addPoint(position);
                const paths = this._document.getPatternPaths();
                if (paths.length < 2) {
                    return;
                }

                const firstPoint = this._currPath.getPoints()[0];
                let intersection = this._checkEndpointIntersections(position);
                if (intersection && !intersection.point.isWithinRadius(firstPoint, 10)) {
                    this._isTracing = false;
                    this._endTracing(position);
                    return;
                }

                intersection = PathIntersection.findIntersectionOfPatternPathsByLineSeg(this._currPath, paths);
                if (intersection && !intersection.point.isWithinRadius(firstPoint, 10)) {
                    this._isTracing = false;
                    this._endTracing(intersection.point, this._handleIntersection.bind(null, intersection));
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

    finalReviewInit = (): void => {
        this._pathSelection.clear();

        this._canvas.onmousedown = null;
        this._canvas.onmousemove = null;
    };

    private _checkEndpointIntersections = (point: Point): IIntersection | null => {
        if (!this._currPath) {
            return null;
        }

        const allPaths = this._document.getPatternPaths();
        for (let i = 0; i < allPaths.length; i++) {
            const thatPath = allPaths[i];
            if (this._currPath === thatPath) {
                continue;
            }

            const thatPathPoints = thatPath.getPoints();
            const thatFirstPoint = thatPathPoints[0];
            const thatLastPoint = thatPathPoints[thatPathPoints.length - 1];
            if (point.isWithinRadius(thatFirstPoint, 10)) {
                return {point: thatFirstPoint, pathCrossed: thatPath};
            }

            if (point.isWithinRadius(thatLastPoint, 10)) {
                return {point: thatLastPoint, pathCrossed: thatPath};
            }
        }

        return null;
    };

    private _checkPathStartIntersectionAndSplit = (path: PatternPath, paths: PatternPath[]): void => {
        if (this._checkEndpointIntersections(path.getPoints()[path.getPoints().length - 1])) {
            return;
        }

        const intersection = PathIntersection.findPathStartIntersectAlongPatternPath(path, paths);
        if (intersection) {
            path.snapStartToPoint(intersection.point);
            this._handleIntersection(intersection);
        }
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

    private _endTracing = (position: Point, callback?: Function): void => {
        if (this._currPath) {
            this._currPath.addPoint(position);
            this._currPath.snapEndpoints(this._document.getPatternPaths());
            this._currPath.setFittedSegment();
            if (callback) {
                callback();
            }
            this._checkPathStartIntersectionAndSplit(this._currPath, this._document.getPatternPaths());
            console.log("paths", this._document.getPatternPaths());
            this._canvas.dispatchEvent(new Event('endTracing'));     
        }
        this._resetTracing();
    };

    private _handleIntersection = (intersection: IIntersection): void => {
        const splitPaths = PathIntersection.splitAtIntersection(intersection.point, intersection.pathCrossed);
        this._document.replacePatternPath(intersection.pathCrossed, splitPaths);
    };

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

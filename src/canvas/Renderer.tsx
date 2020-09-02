import { PatternPath } from './PatternPaths/PatternPath';
import { Document } from './Document';
import { PathSelection } from './PathSelection';
import { Point } from './Geometry/Point';
import { PatternPathColor } from './PatternPaths/PatternPathColor';
import { PatternPathType, ToolType } from './Enums';
import { StraightLinePath } from './TracingPaths/StraightLinePath';
import { FreeLinePath } from './TracingPaths/FreeLinePath';
import { PathIntersection } from './PathIntersection';
import { TracingPath } from './TracingPaths/TracingPath';
import { CurveFitter } from './Geometry/CurveFitter';
import { LineSegment } from './Geometry/LineSegment';

export class Renderer implements IRenderer {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _document: Document;
    private _isTracing: boolean;
    private _currPath: TracingPath | null;
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

            // Empty the pattern paths trash from the previous tracing session
            this._document.emptyPatternPathsTrash();

            this._isTracing = true;
            
            switch(this._toolType) {
                case(ToolType.StraightLine):
                    this._currPath = new StraightLinePath();
                    break;
                case(ToolType.Freeline):
                    this._currPath = new FreeLinePath();
                    break;
            }

            const position = new Point(e.offsetX, e.offsetY);
            const snappedPosition = this._checkPathStartIntersectionAndSplit(position, this._document.getPatternPaths());
            this._currPath.addPoint(snappedPosition);
        };

        this._canvas.onmousemove = (e) => {
            if (this._isTracing && this._currPath) {
                const position = new Point(e.offsetX, e.offsetY);
                this._currPath.addPoint(position);
                const patternPaths = this._document.getPatternPaths();
                if (patternPaths.length < 1) {
                    return;
                }

                const intersection = PathIntersection.findIntersectionOfPatternPathsByLineSeg(this._currPath, patternPaths);
                if (intersection) {
                    this._isTracing = false;

                    const pathCrossedStartPoint = intersection.pathCrossed.getPoints()[0];
                    const pathCrossedEndpoint = intersection.pathCrossed.getPoints()[intersection.pathCrossed.getPoints().length - 1];
                    if (intersection.point.isWithinRadius(pathCrossedEndpoint, 10)) {
                        this._endTracing(pathCrossedEndpoint);
                        return;
                    } else if (intersection.point.isWithinRadius(pathCrossedStartPoint, 10)) {
                        this._endTracing(pathCrossedStartPoint);
                        return;
                    }

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
            const pathsRemovedThisTracingSession = this._document.getPatternPathsTrash();
            this._document.removePatternPath();
            this._undoPathReplacementsInTracingSession(pathsRemovedThisTracingSession);
            console.log("paths", this._document.getPatternPaths());
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

    /**
     * Checks if the path starts by intersecting another path. If it does, and that intersection is 
     * near the start of the intersected path, then the path start is snapped to the start of the 
     * intersected path. If that intersection is near the end of the intersecte path, then the path start
     * is snapped to the end of the intersected path. If the path starts near a point along the 
     * intersected path, then the path start is snapped to that point along the intersected path. 
     * If the intersected path is crossed at a point along the path and not an endpoint, the
     * intersected path is bisected at the intersection point and the original path is replaced with
     * the two new paths in the document. 
     */
    private _checkPathStartIntersectionAndSplit = (startPoint: Point, paths: PatternPath[]): Point => {
        const intersection = PathIntersection.findPointIntersectAlongPatternPaths(startPoint, paths);
        if (intersection) {
            const pathCrossedPoints = intersection.pathCrossed.getPoints();
            const pathCrossedStartPoint = pathCrossedPoints[0];
            if (intersection.point.isWithinRadius(pathCrossedStartPoint, 10)) {
                return pathCrossedStartPoint;
            }

            const pathCrossedEndPoint = pathCrossedPoints[pathCrossedPoints.length - 1];
            if (intersection.point.isWithinRadius(pathCrossedEndPoint, 10)) {
                return pathCrossedEndPoint;
            }

            return this._handleIntersection(intersection);
        }
        return startPoint;
    };

    private _draw = (): void => {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    
        this._drawPaths();
    };

    private _drawPaths = (): void => {
        const context = this._context;
        context.lineWidth = 5;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        
        if (this._currPath) {
            const pathColor = PatternPathColor.get(this._pathType);
            if (!pathColor) {
                throw new Error("Could not get path color for " + this._pathType.toString());
            }

            context.strokeStyle = pathColor;
            context.stroke(this._currPath.getPath2D());
        }

        const patternPaths = this._document.getPatternPaths();
        patternPaths.forEach(path => {
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

            if (callback) {
                this._currPath.addPoint(callback());
            }

            let newPatternPath;
            const points = this._currPath.getPoints();
            switch (this._toolType) {
                case ToolType.StraightLine:
                    newPatternPath = new PatternPath(this._pathType, new LineSegment(points[0], points[1]));
                    break;
                case ToolType.Freeline:
                    newPatternPath = new PatternPath(this._pathType, CurveFitter.Fit(points));
            }
            this._document.addPatternPath(newPatternPath);

            console.log("paths", this._document.getPatternPaths());
            this._canvas.dispatchEvent(new Event('endTracing'));     
        }
        this._resetTracing();
    };

    /**
     * Splits the path crossed by the intersection in 2 at the point
     * that is closest to the intersection's point on the path. 
     * Updates the patternPath list in the document, and returns
     * the new endpoint shared by the 2 pieces of the split paths
     * @param intersection 
     */
    private _handleIntersection = (intersection: IIntersection): Point => {
        const splitPaths: PatternPath[] = intersection.pathCrossed.splitAtPoint(intersection.point);
        this._document.replacePatternPath(intersection.pathCrossed, splitPaths);
        return splitPaths[1].getPoints()[0];
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

    private _undoPathReplacementsInTracingSession = (pathsRemovedThisTracingSession: IPatternPathTrash[]): void => {
        pathsRemovedThisTracingSession.forEach(pathRemoved => {
            const replacements = pathRemoved.replacement;
            replacements.forEach(replacement => {
                this._document.removeSpecificPatternPath(replacement);
            });
            this._document.addPatternPath(pathRemoved.path);
        });
    };

    // private _update = (): void => {
    //     console.log("update");
    // }

}

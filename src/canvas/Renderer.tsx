import { PatternPath } from './PatternPaths/PatternPath';
import { Document } from './Document';
import { PathSelection } from './PathSelection';
import { Point } from './Geometry/Point';
import { PatternPathColor } from './PatternPaths/PatternPathColor';
import { PatternPathType, ToolType, SnapRadius } from './Enums';
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
    private _isInited: boolean;

    constructor (documentModel: Document, pathSelectionModel: PathSelection) {
        this._canvas = document.createElement('canvas');
        this._canvas.setAttribute('id', 'tracingCanvas');

        const contextOrNull = this._canvas.getContext('2d');
        if (!contextOrNull) {
            throw new Error("Could not create 2D context for canvas.");
        }

        this._isInited = false;
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
        // If we have already run init, do not run again!
        if (this._isInited) {
            this._clearCanvas();
            this._tick();
            return this._canvas;
        }

        this._isInited = true;

        this._tick();

        this._canvas.onpointerdown = (e) => {
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
                default:
                    throw new Error("Could not identify the tool type");
            }

            const position = new Point(e.offsetX, e.offsetY);
            this._currPath.addPoint(position);
            // Try to snap to other endpoints
            const snapStartPoint = this._currPath.snapStartPoint(this._document.getPatternPaths());
            // If we were unable to snap to other endpoints, we will try to snap along other paths.
            if (!snapStartPoint) {
                const snappedPosition = this._checkPointIntersectionAndSplit(position, this._document.getPatternPaths());
                this._currPath.snapStartPointTo(snappedPosition);
            }
        };

        this._canvas.onpointermove = (e) => {
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

                    const pathCrossedStartPoint = intersection.pathCrossed.getStart();
                    const pathCrossedEndpoint = intersection.pathCrossed.getEnd();
                    if (intersection.point.isWithinRadius(pathCrossedEndpoint, SnapRadius.mobile)) {
                        this._endTracing(pathCrossedEndpoint, false);
                        return;
                    } else if (intersection.point.isWithinRadius(pathCrossedStartPoint, SnapRadius.mobile)) {
                        this._endTracing(pathCrossedStartPoint, false);
                        return;
                    }

                    this._splitPathAtIntersection(intersection);
                    this._endTracing(intersection.point, false);
                }
            }
        };
        
        this._canvas.onpointerup = (e) => {
            endInteraction(e.offsetX, e.offsetY);
        };

        // If the user draws off the canvas, we will stop adding to the path.
        this._canvas.onpointerleave = (e) => {
            endInteraction(e.offsetX, e.offsetY);
        };

        const endInteraction = (x: number, y: number) => {
            const position = new Point(x, y);
            if (this._isTracing) {
                // Moved this._isTracing = false out of _resetTracing beecause onmouseup and onmouseout are both fired.
                // This means that _endTracing was called multiple times.
                this._isTracing = false;
                this._endTracing(position, true);
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
        }) as EventListener);

        window.addEventListener('resize', () => this._updateCanvasSize());

        return this._canvas;
    };

    measurementInit = (): void  => {
        const dpr = window.devicePixelRatio;
        const patternPaths = this._document.getPatternPaths();
        
        this._canvas.onpointerdown = (e) => {
            for (let i = 0; i < patternPaths.length; i++) {
                if (this._context.isPointInStroke(patternPaths[i].getPath2D(), e.offsetX * dpr, e.offsetY * dpr)) {
                    this._pathSelection.setSelectedPath(patternPaths[i]);
                    break;
                }
            }
        };

        this._canvas.onpointermove = (e) => {
            this._pathSelection.setHighlightedPath(null);
            for (let i = 0; i < patternPaths.length; i++) {
                if (this._context.isPointInStroke(patternPaths[i].getPath2D(), e.offsetX * dpr, e.offsetY * dpr)) {
                    this._pathSelection.setHighlightedPath(patternPaths[i]);
                    break;
                }
            }
        };

        this._canvas.onpointerup = null;
        this._canvas.onpointerout = null;
        this._canvas.onpointerleave = null;
    };

    /**
     * Checks if the point intersects another path. If it doesn't, it returns the point 
     * itself. If it does and the intersection is close to an endpoint of the path, we 
     * return the endpoint. Otherwise, the intersected path is bisected at the intersection 
     * point and the original path is replaced with the two new paths in the document, 
     * and the point that bisects the path is returned.
     */
    private _checkPointIntersectionAndSplit = (point: Point, paths: PatternPath[]): Point => {
        const intersection = PathIntersection.findPointIntersectAlongPatternPaths(point, paths);
        
        if (intersection) {
            if (intersection.pathCrossed.getStart().isWithinRadius(intersection.point, SnapRadius.mobile)) {
                return intersection.pathCrossed.getStart();
            } else if (intersection.pathCrossed.getEnd().isWithinRadius(intersection.point, SnapRadius.mobile)) {
                return intersection.pathCrossed.getEnd();                
            } else { // the intersection is along the path, not close to the  
                     // endpoints, so we can split safely
                this._splitPathAtIntersection(intersection);
                return intersection.point;
            }
        }
        return point;
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

    private _endTracing = (position: Point, snapEndPoint: boolean): void => {
        if (this._currPath) {
            this._currPath.addPoint(position);

            // Require a minimum of 2 points for lines and 3 points for curves
            if ((this._toolType === ToolType.StraightLine && this._currPath.getPoints().length < 2) ||
                (this._toolType === ToolType.Freeline && this._currPath.getPoints().length < 3)) {
                this._discardCurrPath();
                return;
            } 
            
            if (snapEndPoint) {
                // Try to snap to other endpoints
                const snappedToEndPoint = this._currPath.snapEndPoint(this._document.getPatternPaths());
                
                // If we were unable to snap to other endpoints, we will try to snap along other paths.
                if (!snappedToEndPoint) {
                    const snappedPosition = this._checkPointIntersectionAndSplit(position, this._document.getPatternPaths());
                    this._currPath.snapEndPointTo(snappedPosition);
                }
            }
            
            // If the start is too close to the end, discard currPath
            if (this._currPath.isFirstPointCloseToLastPoint(10)) {
                this._discardCurrPath();
                return;
            }

            let newPatternPath;
            const points = this._currPath.getPoints();
            switch (this._toolType) {
                case ToolType.StraightLine:
                    newPatternPath = new PatternPath(this._pathType, [new LineSegment(points[0], points[1])]);
                    break;
                case ToolType.Freeline:
                    newPatternPath = new PatternPath(this._pathType, [CurveFitter.Fit(points)]);
            }
            this._document.addPatternPath(newPatternPath);
            this._canvas.dispatchEvent(new Event('endTracing'));
        }
        
        this._resetTracing();
    };

    /**
     *  Undoes any path splitting we might have done while drawing currPath and 
     *  resets currPath
     */
    private _discardCurrPath = () => {
        const pathsRemovedThisTracingSession = this._document.getPatternPathsTrash();
        this._undoPathReplacementsInTracingSession(pathsRemovedThisTracingSession);
        this._currPath = null;
    };

    /**
     * Splits the path from the intersection in 2 paths at the point
     * that is closest to the intersection's point on the path. 
     * Updates the patternPath list in the document, and returns
     * the new endpoint shared by the 2 pieces of the split paths
     * @param intersection 
     */
    private _splitPathAtIntersection = (intersection: IIntersection): void => {
        const splitPaths: PatternPath[] = intersection.pathCrossed.splitAtPoint(intersection.point, intersection.indexOfSegmentCrossed);
        // update the intersection to hold the splitting point
        intersection.point = splitPaths[1].getStart();
        this._document.replacePatternPath(intersection.pathCrossed, splitPaths);
    };

    private _clearCanvas = (): void => {
        this._document.clearDocument();
        this._isTracing = false;
        this._currPath = null;
        this._pathType = PatternPathType.UNDEFINED;
        // The default tool type is a straight line tool.
        this._toolType = ToolType.StraightLine;
        this._pathSelection.clear();
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
        if (this._canvas.width === 300 && this._canvas.height === 150) {
            this._updateCanvasSize();
        }

        this._draw();
    
        requestAnimationFrame(this._tick);
    };

    private _updateCanvasSize = (): void => {
        const canvasEl = document.getElementById('tracingCanvas');
        
        if (!canvasEl) {
            return;
        }

        const elWidth = canvasEl.getBoundingClientRect().width;
        const elHeight = canvasEl.getBoundingClientRect().height;
        const dpr = window.devicePixelRatio || 1;

        this._canvas.width =  dpr * elWidth;
        this._canvas.height = dpr * elHeight;
        this._context.scale(dpr, dpr);
        // TODO: Recalculate paths after canvas size is updated
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
}

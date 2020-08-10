import { PatternPath } from './PatternPath';
import { Document, globalDocument } from './Document';
import { Point } from './Point';
import { PatternPathColor } from './PatternPathColor';
import { PatternPathType, ToolType } from './Enums';
import { PathSelection } from './PathSelection';

class Renderer implements IRenderer {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _document: Document;
    private _isTracing: boolean;
    private _currPath: PatternPath | null;
    private _pathType: PatternPathType;
    private _toolType: ToolType;
    private _pathSelection: PathSelection;

    constructor () {
        this._canvas = document.createElement('canvas');
        this._canvas.width = 300;
        this._canvas.height = 400;

        const contextOrNull = this._canvas.getContext('2d');
        if (!contextOrNull) {
            throw new Error("Could not create 2D context for canvas.");
        }

        this._context = contextOrNull;
        this._document = globalDocument;
        this._isTracing = false;
        this._currPath = null;
        this._pathType = PatternPathType.UNDEFINED;
        // The default tool type is a straight line tool.
        this._toolType = ToolType.StraightLine;
        this._pathSelection = new PathSelection();
    }

    init = (): HTMLCanvasElement => {
        this._tick();

        this._canvas.onmousedown = (e) => {
            if (!this._pathType) {
                throw new Error("Path type not set");
            }

            this._isTracing = true;
            
            // TODO: setTool Type when creating a new path.
            this._currPath = new PatternPath(this._pathType, this._toolType);
            this._document.addPatternPath(this._currPath);
            this._currPath.addPoint(new Point(e.offsetX, e.offsetY));
        };

        this._canvas.onmousemove = (e) => {
            if (this._isTracing && this._currPath) {
                this._currPath.addPoint(new Point(e.offsetX, e.offsetY));
            }
        };
        
        this._canvas.onmouseup = (e) => {
            const position = new Point(e.offsetX, e.offsetY);
            if (this._isTracing) {
                this._endTracing(position);
            }
        };

        // If the user draws off the canvas, we will stop adding to the path.
        this._canvas.onmouseout = (e) => {
            const position = new Point(e.offsetX, e.offsetY);
            if(this._isTracing) {
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
    }

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
    }
    
    getPathSelection = (): PatternPath | null => {
        return this._pathSelection.getSelectedPath();
    }

    getDocument = (): Document => {
        return this._document;
    }

    private _endTracing = (position: Point): void => {
        if (this._currPath) {
            this._currPath.addPoint(position); 
            this._currPath.snapEndpoints(this._document.getPatternPaths());
            if (this._toolType === ToolType.Freeline) {
                this._currPath.fitCurve();
            }

            this._canvas.dispatchEvent(new Event('endTracing'));     
        }
        this._resetTracing();
    }

    private _draw = (): void => {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    
        this._drawPatternPaths();
    }

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
    }

    private _resetTracing = (): void => {
        this._isTracing = false;  
        this._currPath = null;
        this._toolType = ToolType.StraightLine;
    }

    private _setPathType = (type: number): void => {
        this._pathType = type;
    }

    private _setToolType = (type: number): void => {
        this._toolType = type;
    }

    private _tick = (): void => {
        // this._update();
        this._draw();
    
        requestAnimationFrame(this._tick);
    }

    // private _update = (): void => {
    //     console.log("update");
    // }

}

const renderer = new Renderer();

export { renderer };

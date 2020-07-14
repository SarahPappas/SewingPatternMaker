import { PatternPath } from './PatternPath';
import { Document } from './Document';
import { Point } from './Point';
import { PatternPathColor } from './PatternPathColor';
import { PatternPathType } from './Enums';

class Renderer implements IRenderer {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _document: Document;
    private _isTracing: boolean;
    private _currPath: PatternPath | null;

    constructor () {
        this._canvas = document.createElement('canvas');
        this._canvas.width = 300;
        this._canvas.height = 400;

        const contextOrNull = this._canvas.getContext('2d');
        if (!contextOrNull) {
            throw new Error("Could not create 2D context for canvas.");
        }

        this._context = contextOrNull;
        this._document = new Document();
        this._isTracing = false;
        this._currPath = null;
    }

    init = (): HTMLCanvasElement => {
        this._tick();

        this._canvas.onmousedown = (e) => {
            this._isTracing = true;
            
            this._currPath = new PatternPath(PatternPathType.Seam);
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
            this._endTracing(position);
        };

        // If the user draws off the canvas, we will stop adding to the path.
        this._canvas.onmouseout = (e) => {
            const position = new Point(e.offsetX, e.offsetY);
            this._endTracing(position);
        };

        return this._canvas;
    }

    private _endTracing = (position: Point): void => {
        if (this._isTracing && this._currPath) {
            this._currPath.addPoint(position);
        }
        this._isTracing = false;  
        this._currPath = null;
    }

    private _draw = (): void => {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    
        this._drawPatternPaths();
    }

    private _drawPatternPaths = (): void => {
        const context = this._context;
        context.lineWidth = 3;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        
        const paths = this._document.getPatternPaths();
        paths.forEach(path => {
            const path2D = path.getPath2D();
            const pathColor = PatternPathColor.get(path.getType());
            if (!pathColor) {
                throw new Error("Could not get path color for " + path.getType().toString());
            }

            // The color set before stroke will be the color used by the context to stroke the path.
            context.strokeStyle = pathColor;
            context.stroke(path2D);
        });
    }

    private _tick = (): void => {
        // this._update();
        this._draw();
    
        requestAnimationFrame(this._tick);
    }

    //S private _update = (): void => {
    //     console.log("update");
    // }
}

const renderer = new Renderer();

export { renderer };

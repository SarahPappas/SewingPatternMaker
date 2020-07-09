import { PatternPath } from './PatternPath';
import { Document } from './Document';
import { Point } from './Point';
import { PatternPathColor } from './PatterPathColor';
import { PatternPathType } from './Enums';

class Renderer implements IRenderer {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _document: Document;
    private _isTracing: boolean;
    private _currPath: PatternPath | null;

    constructor () {
        this._canvas = document.createElement('canvas');

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
            this._isTracing = false;  
            this._currPath = null;
        };

        return this._canvas;
    }

    private _draw = (): void => {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    
        this._drawPatternPaths();
        // Todo drawpatternpath
        // if (this.path) {
        //     this._context.lineWidth = 3;
        //     this._context?.stroke(this.path);
        // }
    }

    private _drawPatternPaths = (): void => {
        const context = this._context;

        context.lineWidth = 3;
        
        const paths = this._document.getPatternPaths();
        paths.forEach(path => {
            const path2D = path.getPathCanvas2D();
            const pathColor = PatternPathColor.get(path.getType());
            if (!pathColor) {
                throw new Error("Could not get path color for " + path.getType().toString());
            }

            context.strokeStyle = pathColor;

            if (path2D) {
                context.stroke(path2D);
            }
        });
    }

    private _tick = (): void => {
        this._update();
        this._draw();
    
        requestAnimationFrame(this._tick);
    }

    private _update = (): void => {
        console.log("update");
    }
}

const renderer = new Renderer();

export { renderer };

/* MOVE TO CLASS */

// function computeMiddle() {

// }




// const canvasElement = document.createElement("canvas");
// const memCanvas = document.createElement("canvas");

// const canvasHeight = 500;
// const canvasWidth = 500;
// canvasElement.height = canvasHeight;
// canvasElement.width = canvasWidth;
// memCanvas.height = canvasHeight;
// memCanvas.width = canvasWidth;

// const context = canvasElement.getContext('2d');
// const memContext = memCanvas.getContext('2d');

// if (context) {
//     canvasElement.addEventListener('mousedown', handleMouseDown);
//     canvasElement.addEventListener('mouseup', handleMouseUp);
//     canvasElement.addEventListener('mousemove', handleMouseMove);
//     canvasElement.addEventListener('mouseout', handleMouseUp);
// }

// let mouseDown = false;
// let points: Point[] = [];
// let lastLength = 0;

// requestAnimationFrame(draw);

// function handleMouseDown(evt: MouseEvent) {
//     mouseDown = true;
//     points.push({x: evt.offsetX, y: evt.offsetY});
// }

// function handleMouseUp(evt: MouseEvent) {
//     mouseDown = false;
//     points = [];
//     lastLength = 0;
//     if (memContext) {
//         memContext.clearRect(0, 0, canvasWidth, canvasHeight);
//         memContext.drawImage(canvasElement, 0, 0);
//     }
// }

// function handleMouseMove(evt: MouseEvent) {
//     if (mouseDown) {
//         points.push({x: evt.offsetX, y: evt.offsetY});
//     }
// }

// function draw() {
//     if (context) {
//         const length = points.length;

//         // This avoids re-drawing when no new points were drawn on the canvas
//         if (length === lastLength) {
//             requestAnimationFrame(draw);
//             return;
//         }
//         lastLength = length;

//         if (length > 2) {
//             context.clearRect(0, 0, canvasWidth, canvasHeight);
//             context.drawImage(memCanvas, 0, 0);
//             context.beginPath();
//             context.moveTo(points[0].x, points[0].y);
//             context.lineCap = 'round';
//             context.lineWidth = 3;
//             let i: number;
//             for (i = 1;i < length - 2;i++ ) {
//                 //Compute the middle point
//                 const middle = {x: ((points[i].x + points[i + 1].x) / 2), y: ((points[i].y + points[i + 1].y) / 2)};
//                 context.quadraticCurveTo(points[i].x, points[i].y, middle.x, middle.y);
//             }
//             context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
//             context.stroke();
//             context.closePath();
//         }

//         requestAnimationFrame(draw);
//     }
// }

//export { canvas };
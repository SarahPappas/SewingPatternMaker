
const canvasElement = document.createElement("canvas");

canvasElement.style.border = '2px solid #000'
canvasElement.height = 500
canvasElement.width = 500

const context = canvasElement.getContext('2d');

if (context) {
    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mouseup', handleMouseUp);
    canvasElement.addEventListener('mousemove', handleMouseMove);
}

let mouseDown: boolean = false;
let points: Point[] = [];
let lastLength: number = 0;
let memCanvas = document.createElement("canvas");
memCanvas.height = 500;
memCanvas.width = 500;
const memContext = memCanvas.getContext('2d');

requestAnimationFrame(draw);

function handleMouseDown(evt: MouseEvent) {
    mouseDown = true;
    points.push({x: evt.offsetX, y: evt.offsetY});
}

function handleMouseUp(evt: MouseEvent) {
    mouseDown = false;
    points = [];
    lastLength = 0;
    memContext?.clearRect(0, 0, 500, 500);
    memContext?.drawImage(canvasElement, 0, 0);
}

function handleMouseMove(evt: MouseEvent) {
    if (mouseDown) {
        points.push({x: evt.offsetX, y: evt.offsetY});
    }
}

function draw() {
    if (context) {
        let length = points.length;
        if (length === lastLength) {
            requestAnimationFrame(draw);
            return;
        }
        lastLength = length;

        if (length > 3) {
            context.clearRect(0, 0, 500, 500);
            context.drawImage(memCanvas, 0, 0);
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            let i: number;
            for (i = 1; i < length - 2; i++ ) {
                var c = (points[i].x + points[i + 1].x) / 2,
                    d = (points[i].y + points[i + 1].y) / 2;
                context.quadraticCurveTo(points[i].x, points[i].y, c, d)
            }
            context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
            context.stroke();
            context.closePath();
        }

        requestAnimationFrame(draw);
    }
}

export { canvasElement }
const canvasElement = document.createElement("canvas");
const memCanvas = document.createElement("canvas");

const canvasHeight = 500;
const canvasWidth = 500;
canvasElement.height = canvasHeight;
canvasElement.width = canvasWidth;
memCanvas.height = canvasHeight;
memCanvas.width = canvasWidth;
canvasElement.style.border = '2px solid #000';

const context = canvasElement.getContext('2d');
const memContext = memCanvas.getContext('2d');

if (context) {
    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mouseup', handleMouseUp);
    canvasElement.addEventListener('mousemove', handleMouseMove);
    canvasElement.addEventListener('mouseout', handleMouseUp);
}

let mouseDown = false;
let points: Point[] = [];
let tempPoints: Point[] = [];
let lastLength = 0;

requestAnimationFrame(draw);

function handleMouseDown(evt: MouseEvent) {
    mouseDown = true;
    const start = {x: evt.offsetX, y: evt.offsetY};
    points.push(start);
    tempPoints = [];
    tempPoints.push(start);
}

function handleMouseUp(evt: MouseEvent) {
    points.push({x: evt.offsetX, y: evt.offsetY});
    tempPoints = [];
    setTimeout(() => {
        mouseDown = false;
        points = [];
        lastLength = 0;
        if (memContext) {
            memContext.clearRect(0, 0, canvasWidth, canvasHeight);
            memContext.drawImage(canvasElement, 0, 0);
        }
    }, 100);    
}

function handleMouseMove(evt: MouseEvent) {
    const newPoint = {x: evt.offsetX, y: evt.offsetY};
    if (mouseDown) {
        tempPoints.push(newPoint);
    }
    
    if (mouseDown && (squaredDistance(newPoint, points[points.length - 1]) > 1000)) {
        points.push(newPoint);
        tempPoints = [];
    }
}

function squaredDistance(p1: Point, p2: Point): number {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

function draw() {
    if (context) {
        const length = points.length;

        if (tempPoints.length > 1) {
            context.beginPath();
            context.moveTo(tempPoints[0].x, tempPoints[0].y);
            for (let i = 1;i < tempPoints.length;i++) {
                context.lineTo(tempPoints[i].x, tempPoints[i].y);
            }
            context.stroke();
            context.closePath();
        }

        // This avoids re-drawing when no new points were drawn on the canvas
        if (length === lastLength) {
            requestAnimationFrame(draw);
            return;
        }
        lastLength = length;

        if (length > 2) {
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(memCanvas, 0, 0);
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineCap = 'round';
            context.lineWidth = 3;
            let i: number;
            for (i = 1;i < length - 2;i++ ) {
                //Compute the middle point
                const middle = {x: ((points[i].x + points[i + 1].x) / 2), y: ((points[i].y + points[i + 1].y) / 2)};
                context.quadraticCurveTo(points[i].x, points[i].y, middle.x, middle.y);
            }
            context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
            context.stroke();
            context.closePath();
        }

        requestAnimationFrame(draw);
    }
}

export { canvasElement };
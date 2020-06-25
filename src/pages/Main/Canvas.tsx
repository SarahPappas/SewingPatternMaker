
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
let lastLength = 0;

requestAnimationFrame(draw);

function handleMouseDown(evt: MouseEvent) {
    mouseDown = true;
    points.push({x: evt.offsetX, y: evt.offsetY});
}

function handleMouseUp(evt: MouseEvent) {
    mouseDown = false;
    points = [];
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

        var point = points[lastLength];
        context.beginPath();
        context.moveTo(point.x, point.y);
        for (var i = lastLength; i < length; i++ ) {
            point = points[i];
            context.lineTo(point.x, point.y);
        }
        context.stroke();
        context.closePath();

        requestAnimationFrame(draw);
    }
}

export { canvasElement }
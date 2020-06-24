import React from 'react'

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
let start: Point = { x: 0, y: 0 };
let end: Point = { x: 0, y: 0 };
let canvasOffsetLeft: number = 0 
let canvasOffsetTop: number = 0 

function handleMouseDown(evt: MouseEvent) {
    mouseDown = true;

    end = {
        x: evt.offsetX - canvasOffsetLeft,
        y: evt.offsetY - canvasOffsetTop,
    };    
}

function handleMouseUp(evt: MouseEvent) {
    mouseDown = false;
}

function handleMouseMove(evt: MouseEvent) {
    if (mouseDown && context) {
        start = {
            x: end.x,
            y: end.y,
        };

        end = {
            x: evt.offsetX - canvasOffsetLeft,
            y: evt.offsetY - canvasOffsetTop,
        }

        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.strokeStyle = '#00f';
        context.lineWidth = 3;
        context.stroke();
        context.closePath();
    }
}

export { canvasElement }
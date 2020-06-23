import React from 'react';
import { NavButton } from './NavButton';
import { CanvasObject } from './CanvasObject';

const button: Button = {text: " canvas"};

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);
  const [wrapped, setWrapped] = React.useState<Boolean>(false);

  React.useEffect(() => {
    let mouseDown: boolean = false;
    let start: Point = { x: 0, y: 0 };
    let end: Point = { x: 0, y: 0 };
    let canvasOffsetLeft: number = 0;
    let canvasOffsetTop: number = 0;
    
    function handleMouseDown(evt: MouseEvent) {
      mouseDown = true;

      end = {
        x: evt.clientX - canvasOffsetLeft,
        y: evt.clientY - canvasOffsetTop,
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
          x: evt.clientX - canvasOffsetLeft,
          y: evt.clientY - canvasOffsetTop,
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

    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d');

      if (renderCtx) {
        canvasRef.current.addEventListener('mousedown', handleMouseDown);
        canvasRef.current.addEventListener('mouseup', handleMouseUp);
        canvasRef.current.addEventListener('mousemove', handleMouseMove);

        canvasOffsetLeft = canvasRef.current.offsetLeft;
        canvasOffsetTop = canvasRef.current.offsetTop;

        setContext(renderCtx);
      }
    }

    return function cleanup() {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
        canvasRef.current.removeEventListener('mouseup', handleMouseUp);
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    }
  }, [context]);

  return (
    <React.Fragment>
      <CanvasObject canvasRef={canvasRef} wrapped={wrapped}/>
      <NavButton button={button} wrapped={wrapped} setWrap={setWrapped}/>
    </React.Fragment>
    
  );
}

export default App;

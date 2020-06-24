import React from 'react';

interface CanvasObjectProps {
    draw: (canvas: CanvasRenderingContext2D, location: {x:number, y: number}) => void;
};

export const CanvasObject: React.FC<CanvasObjectProps> = ({draw}) => {
  const canvasRef = React.useRef(document.createElement("canvas"));

  const [locations, setLocations] = React.useState([] as Point[]);

  const onClick = (e: { clientX: number; clientY: number; }) => {
    const canvas = canvasRef.current;
    let context: CanvasRenderingContext2D | null;
    if (!(context = canvas.getContext('2d'))) {
      throw new Error(`2d context not supported or canvas already initialized`);
    }
    const newLocation: Point = {x: e.clientX, y: e.clientY }
    setLocations([...locations, newLocation]);
    draw(context, newLocation )
  }

  // React.useEffect(() => {
  //   const canvas = canvasRef.current;
  //   let context: CanvasRenderingContext2D | null;
  //   if (!(context = canvas.getContext('2d'))) {
  //     throw new Error(`2d context not supported or canvas already initialized`);
  //   }

  //   let frameCount = 0
  //   let animationFrameId: number;

  //   const render = () => {
  //     if (!context) {
  //       throw new Error('error');
  //     }
  //     frameCount++;
  //     draw(context);
  //     animationFrameId = window.requestAnimationFrame(render);
  //   }

  //   render();

  //   return () => {
  //     window.cancelAnimationFrame(animationFrameId);
  //   }
    
  // }, [draw])

  console.log(locations);

  return (
    <div style={{textAlign: 'center',}}>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={500}
        height={500}
        onClick={onClick}
        style={{
          border: '2px solid #000',
          marginTop: 10,
        }}
      ></canvas>
    </div>
  );
}

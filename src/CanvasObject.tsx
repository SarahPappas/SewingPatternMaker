import React from 'react';

interface CanvasObjectProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CanvasObject: React.FC<CanvasObjectProps> = ({canvasRef}) => {
    return <div style={{textAlign: 'center',}}>
    <canvas
      id="canvas"
      ref={canvasRef}
      width={500}
      height={500}
      style={{
        border: '2px solid #000',
        marginTop: 10,
      }}
    ></canvas>
  </div>
} 
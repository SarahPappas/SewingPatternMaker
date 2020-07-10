import React from "react";
import { canvasElement } from "../../canvas/Canvas";
import './CanvasContainer.css';

interface CanvasContainerProps {
  canvasContainerRef: React.RefObject<HTMLDivElement>;
}

const CanvasContainer: React.FC<CanvasContainerProps> = ({canvasContainerRef}) => {

  React.useEffect(() => {
    if (canvasContainerRef.current) {
      canvasContainerRef.current.appendChild(canvasElement);
    }
  }, [canvasContainerRef]);

  return <div className='canvasContainer' ref={canvasContainerRef}></div>;
};

export { CanvasContainer };
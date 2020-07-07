import React from "react";
import { canvas } from "../../canvas/Canvas";
import './CanvasContainer.css';

const CanvasContainer: React.FC = () => {
  const canvasContainerRef = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    canvasContainerRef.current.appendChild(canvas);
  }, []);

  return <div className='canvasContainer' ref={canvasContainerRef}></div>;
};

export { CanvasContainer };
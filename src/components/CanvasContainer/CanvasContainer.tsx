import React from "react";
import { renderer } from "../../canvas/Renderer";
import './CanvasContainer.css';

const CanvasContainer: React.FC = () => {
  const canvasContainerRef = React.useRef(document.createElement("div"));
  const canvas = renderer.init();

  React.useEffect(() => {
    canvasContainerRef.current.appendChild(canvas);
  }, []);

  return <div className='canvasContainer' ref={canvasContainerRef}></div>;
};

export { CanvasContainer };
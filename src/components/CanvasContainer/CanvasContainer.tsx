import React, { MutableRefObject } from "react";
import { canvasElement } from "../../canvas/Canvas";
import './CanvasContainer.css';

let canvasContainerRef: MutableRefObject<HTMLDivElement>;

const CanvasContainer: React.FC = () => {
  canvasContainerRef = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    canvasContainerRef.current.appendChild(canvasElement);
  }, []);

  return <div className='canvasContainer' ref={canvasContainerRef}></div>;
};

export { CanvasContainer, canvasContainerRef };
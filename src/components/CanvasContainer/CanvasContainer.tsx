import React from "react";
import { canvasElement } from "../../canvas/Canvas";
import './CanvasContainer.css';

interface CanvasContainerProps {
    
}

const CanvasContainer: React.FC<CanvasContainerProps> = () => {
  const canvasContainerRef = React.useRef(document.createElement("div"));

  React.useEffect(()=>{
    canvasContainerRef.current.appendChild(canvasElement);
  }, [])

  return <div className='canvasContainer' ref={canvasContainerRef}></div>
}

export { CanvasContainer };
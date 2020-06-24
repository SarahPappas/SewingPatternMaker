import React from "react";
import { canvasElement } from "./Canvas";
import './CanvasDiv.css';

interface CanvasDivProps {
    
}

const CanvasDiv: React.FC<CanvasDivProps> = () => {
  const canvasContainerRef = React.useRef(document.createElement("div"));

  React.useEffect(()=>{
    canvasContainerRef.current.appendChild(canvasElement);
  }, [])

  return <div className='canvasDiv' ref={canvasContainerRef}></div>
}

export { CanvasDiv };


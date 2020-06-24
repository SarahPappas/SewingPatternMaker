import React from "react";
import { canvasElement } from "./Canvas";

interface CanvasDivProps {
    
}

const CanvasDiv: React.FC<CanvasDivProps> = () => {
  const canvasContainerRef = React.useRef(document.createElement("div"));

  React.useEffect(()=>{
    canvasContainerRef.current.appendChild(canvasElement);
  }, [])

  return <div style={{textAlign: 'center',}} ref={canvasContainerRef}></div>
}

export { CanvasDiv };


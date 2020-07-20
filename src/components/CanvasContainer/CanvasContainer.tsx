import React from "react";
import { renderer } from "../../canvas/Renderer";
import './CanvasContainer.css';

interface CanvasContainerProps {
  uploadedFileData: string;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ uploadedFileData }) => {
  const canvasContainerRef = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    const canvas = renderer.init();
    if (canvasContainerRef.current) {
      canvasContainerRef.current.appendChild(canvas);
      canvasContainerRef.current.style.backgroundImage = "url(" + uploadedFileData + ")";
    }
  }, [canvasContainerRef, uploadedFileData]);

  return <div className='canvasContainer' ref={canvasContainerRef}></div>;
};
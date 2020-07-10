import React from "react";
import { canvasElement } from "../../canvas/Canvas";
import './CanvasContainer.css';

interface CanvasContainerProps {
  uploadedFileData: string;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ uploadedFileData }) => {
  const canvasContainerRef = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    if (canvasContainerRef.current) {
      canvasContainerRef.current.appendChild(canvasElement);
      canvasContainerRef.current.style.backgroundImage = "url(" + uploadedFileData + ")";
    }
  }, [canvasContainerRef, uploadedFileData]);

  return <div className='canvasContainer' ref={canvasContainerRef}></div>;
};
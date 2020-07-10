import React from "react";
import { canvasElement } from "../../canvas/Canvas";
import './CanvasContainer.css';
import { uploadedFileData } from "components/UploadPhoto/UploadPhoto";

const CanvasContainer: React.FC = () => {
  const canvasContainerRef = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    if (canvasContainerRef.current) {
      canvasContainerRef.current.appendChild(canvasElement);
      canvasContainerRef.current.style.backgroundImage = "url(" + uploadedFileData + ")";
    }
  }, [canvasContainerRef]);

  return <div className='canvasContainer' ref={canvasContainerRef}></div>;
};

export { CanvasContainer };
import React, { useEffect } from "react";
import { App } from "../../canvas/AppController";
import './CanvasContainer.css';

interface CanvasContainerProps {
  uploadedFileData: string;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ uploadedFileData }) => {
  const canvasContainerRef = React.useRef(document.createElement("div"));

  useEffect(() => {
    const canvas = App.renderer.init();
    if (canvasContainerRef.current) {
      canvasContainerRef.current.appendChild(canvas);

      // Fix size of canvas container
      // TODO: Eventually we would like to dynamically resize the canvas and container.
      canvasContainerRef.current.style.width = String(canvasContainerRef.current.clientWidth) + "px";
      canvasContainerRef.current.style.height = String(canvasContainerRef.current.clientHeight) + "px";
      // Update the canvas size from the default size it is initalized to, to the actual size.
      const initializeCanvasSize = new CustomEvent('initializeCanvasSize');
      canvas.dispatchEvent(initializeCanvasSize);
    }

    //Prevent default touch events on canvas container so that the touch event can pass through to the canvas.
    document.querySelectorAll('.canvasContainer')[0].addEventListener('touchstart', (e) => {
      e.preventDefault();
    });
  }, [canvasContainerRef]);

  // We keep setting up the background image in a separate useEffect 
  // to avoid resetting the renderer and reappending the canvas as a 
  // child on every change to the background photo.
  useEffect(() => {
    canvasContainerRef.current.style.backgroundImage = "url(" + uploadedFileData + ")";
  }, [uploadedFileData]);

  return <div className='canvasContainer' ref={canvasContainerRef}></div>;
};
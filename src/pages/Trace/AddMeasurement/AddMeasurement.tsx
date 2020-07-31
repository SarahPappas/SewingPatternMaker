import React, { useEffect, useRef } from 'react';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import './AddMeasurement.css';
import { renderer } from 'canvas/Renderer';

interface AddMeasurementProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
}

export const AddMeasurement: React.FC<AddMeasurementProps> = ({ setUploadedFileData }) => {
    const instructModal: InstructModal = {text: ['Choose a path to measure.']};
    
    // Reinitialize event listeners on canvas
    useEffect(() => {
        renderer.measurementInit();
    }, []);

    // Remove class that puts canvas in the background.
    const canvasContainerRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasContainerRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasContainerRef.current.classList.remove('canvasContainerBackground');
    }, [canvasContainerRef]);

    // Remove the photo in the background
    useEffect(() => {
        setUploadedFileData("");
    }, [setUploadedFileData]);

    // Get the Canvas so that we can and an event listener to it.
    const canvasRef = useRef(document.querySelector('canvas'));
    useEffect(() => {
        canvasRef.current = document.querySelector('canvas');
        
    }, [canvasRef]);

    canvasRef.current?.addEventListener("selectPath", () => {
        console.log("path selected");
    });

    return (
        <>
            <div className={'measurementInstructionsContainer'}>
                <InstructionModal instructModal={instructModal}></InstructionModal>
            </div>
            <div>
                <div>
                    Measurement
                </div>
                <div>
                    <div>
                        input box
                    </div>
                    <div>
                        in
                    </div>
                    <div>
                        Button
                    </div>
                </div>
            </div>
        </>
    );
};
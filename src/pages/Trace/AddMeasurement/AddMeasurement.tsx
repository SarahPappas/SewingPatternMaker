import React, { useEffect, useRef } from 'react';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import './AddMeasurement.css';
import { useHistory } from 'react-router-dom';

interface AddMeasurementProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
}

export const AddMeasurement: React.FC<AddMeasurementProps> = ({ setUploadedFileData }) => {
    const instructModal: InstructModal = {text: ['Choose a path to measure.']};
    
    // Remove class that puts canvas in the background.
    const canvasContainerRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasContainerRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasContainerRef.current.classList.remove('canvasContainerBackground');
    }, [canvasContainerRef]);


    //const canvasContainerRef = useRef(document.querySelector<HTMLElement>('canvasContainer'));
    useEffect(() => {
        setUploadedFileData("");
    }, [setUploadedFileData]);

    // Get the Canvas so that we can and an event listener to it.
    const canvasRef = useRef(document.querySelector('canvas'));
    useEffect(() => {
        canvasRef.current = document.querySelector('canvas');
    }, [canvasRef]);
    
    const history = useHistory();

    canvasRef.current?.addEventListener("endTracing", () => {
        history.push('/Trace/Review');
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
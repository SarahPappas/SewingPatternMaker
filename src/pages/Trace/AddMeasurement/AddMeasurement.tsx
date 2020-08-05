import React, { useEffect, useRef } from 'react';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import './AddMeasurement.css';
import { renderer } from 'canvas/Renderer';
import { InputButton } from 'components/InputButton/InputButton';
import { ActionButton } from 'components/ActionButton/ActionButton';
import check from '../../../assets/defaultPhoto.jpg';

interface AddMeasurementProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
}

export const AddMeasurement: React.FC<AddMeasurementProps> = ({ setUploadedFileData }) => {
    
    // Remove class that puts canvas in the background, remove picture,
    // and reinitialize event listeners.
    const canvasContainerRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasContainerRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasContainerRef.current.classList.remove('canvasContainerBackground');
        canvasContainerRef.current.appendChild(renderer.measurementInit());
        setUploadedFileData("");
    }, [canvasContainerRef, setUploadedFileData]);

    const handleSubmit = () => {
        console.log('handleSubmit');
    };

    const instructModal: InstructModal = {text: ['Choose a path to measure.']};

    const input = { id: 'measurement-input', type: 'text', className: ''};

    const button: ActionButton = {label: '', action: handleSubmit};
    
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
                    <InputButton input={input}></InputButton>
                    <ActionButton button={button}>
                        <img className='submitButton' src={check} alt='submit'/>
                    </ActionButton>
                </div>
            </div>
        </>
    );
};
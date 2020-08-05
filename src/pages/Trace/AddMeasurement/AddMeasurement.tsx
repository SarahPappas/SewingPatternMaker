import React, { useEffect, useRef } from 'react';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import './AddMeasurement.css';
import { renderer } from 'canvas/Renderer';
import { Input } from 'components/Input/Input';
import { ActionButton } from 'components/ActionButton/ActionButton';
import check from '../../../assets/defaultPhoto.jpg';
import { NavButton } from 'components/NavButton/NavButton';

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

    const handleChange = () => {
        console.log('handle change');
    };

    const instructModal: InstructModal = {text: ['Choose a path to measure.']};

    const input = { id: 'measurement-input', type: 'text', className: '', onChange: handleChange};

    const button: NavButton = {label: '', to: ''};
    
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
                    <Input input={input}></Input>
                    
                    <NavButton button={button}>
                        <img className='submitButton' src={check} alt='submit'/>
                    </NavButton>
                </div>
            </div>
        </>
    );
};
import React, { useEffect, useRef } from 'react';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import './AddMeasurement.css';
import { renderer } from 'canvas/Renderer';
import { Input } from 'components/Input/Input';
import checkIcon from '../../../assets/defaultPhoto.jpg';
import { NavButton } from 'components/NavButton/NavButton';
import { ActionButton } from 'components/ActionButton/ActionButton';

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

    const input: Input = { id: 'measurement-input', type: 'text', className: 'measurementInput', onChange: handleChange};

    const navButton: NavButton = {label: '', to: '/Trace/AddMeasurement'};
    const actionButton: ActionButton = {label: '', action: handleSubmit};
    
    return (
        <>
            <div className={'measurementInstructionsContainer'}>
                <InstructionModal instructModal={instructModal}></InstructionModal>
            </div>
            <div className={'measurementBottomContainer'}>
                <div className={'text'}>
                    Measurement
                </div>
                <div className={'measurementInputContainer'}>
                    <Input input={input}></Input>

                    <div className={'text'}>
                        IN
                    </div>

                    <NavButton button={navButton}>
                        <ActionButton button={actionButton}>
                            <img className='submitIcon' src={checkIcon} alt='submit'/>
                        </ActionButton>
                    </NavButton>
                </div>
            </div>
        </>
    );
};
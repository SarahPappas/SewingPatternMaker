import React, { useEffect, useRef, ChangeEvent } from 'react';
import './AddMeasurement.css';
import checkIcon from '../../../assets/check-icon.svg';
import { renderer } from 'canvas/Renderer';
import { Modal } from 'components/Modal/Modal';
import { Input } from 'components/Input/Input';
import { NavButton } from 'components/NavButton/NavButton';
import { ActionButton } from 'components/ActionButton/ActionButton';
import { ModalType } from 'canvas/Enums';

interface AddMeasurementProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
}

export const AddMeasurement: React.FC<AddMeasurementProps> = ({ setUploadedFileData }) => {
    const [inputMeasurement, setInputMeasurement] = React.useState<string>("");
    
    // Remove class that puts canvas in the background, remove picture,
    // and reinitialize event listeners.
    const canvasContainerRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasContainerRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasContainerRef.current.classList.remove('canvasContainerBackground');
        renderer.measurementInit();
        setUploadedFileData("");
    }, [canvasContainerRef, setUploadedFileData]);

    const selectionWarning: Modal = {text: ['Please select a path'], type: ModalType.Warning}; 
    const numberWarning: Modal = {text: ['Please enter a decimal number'], type: ModalType.Warning};
    const warningModal = useRef(<></>);

    const handleSubmit = () => {
        if (parseFloat(inputMeasurement).toString() !== inputMeasurement.trim()) {
            warningModal.current = <Modal modal={numberWarning} />;
        } else {
            const selectedPath = renderer.getPathSelection();
            if (!selectedPath) {
                warningModal.current = <Modal modal={selectionWarning} />;
            } else {
                warningModal.current = <></>;
                renderer.getDocument().setSizeRatio(parseFloat(inputMeasurement), selectedPath);
            }
        }
    };

    const instructModal: Modal = {text: ['Choose a line to measure.'], type: ModalType.Instruction};

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputMeasurement(e.target.value);
        warningModal.current = <></>;
    };

    const input: Input = { 
        id: 'measurement-input', 
        type: 'text', 
        className: 'measurementInput',
        onChange: handleInputChange
    };

    // TODO: link this navButton to final review/printing page
    const navButton: NavButton = {label: '', to: '/Trace/AddMeasurement'};
    
    const actionButton: ActionButton = {label: '', action: handleSubmit};
    
    return (
        <>
            <div className={'measurementInstructionsContainer'}>
                <Modal modal={instructModal}></Modal>
            </div>
            <div className={'measurementBottomContainer'}>
                {warningModal.current}
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
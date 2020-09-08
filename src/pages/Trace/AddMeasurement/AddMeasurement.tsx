import React, { useEffect, useRef, ChangeEvent } from 'react';
import { App } from '../../../canvas/AppController';
import checkIcon from '../../../assets/check-icon.svg';
import { Modal } from 'components/Modal/Modal';
import { Input } from 'components/Input/Input';
import { NavButton } from 'components/NavButton/NavButton';
import { ActionButton } from 'components/ActionButton/ActionButton';
import { ModalType } from 'canvas/Enums';
import './AddMeasurement.css';

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
        App.renderer.measurementInit();
        setUploadedFileData("");
    }, [canvasContainerRef, setUploadedFileData]);

    const selectionWarning: Modal = {text: ['Please select a path'], type: ModalType.Warning}; 
    const numberWarning: Modal = {text: ['Please enter a decimal number'], type: ModalType.Warning};
    const warningModal = useRef(<></>);

    const handleSubmit = () => {
        if (parseFloat(inputMeasurement).toString() !== inputMeasurement.trim()) {
            warningModal.current = <Modal modal={numberWarning} />;
        } else {
            const selectedPath = App.pathSelection.getSelectedPath();
            if (!selectedPath) {
                warningModal.current = <Modal modal={selectionWarning} />;
            } else {
                warningModal.current = <></>;
                App.document.setSizeRatio(parseFloat(inputMeasurement), selectedPath);
                App.document.setAllowanceSizes(); // Setting to default values
                App.document.findPatternPieces();
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
    const navButton: Button = {label: ''};
    
    const actionButton: Button = {label: ''};
    
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

                    <NavButton button={navButton} to={'/FinalReview'}>
                        <ActionButton button={actionButton} action={handleSubmit}>
                            <img className='submitIcon' src={checkIcon} alt='submit'/>
                        </ActionButton>
                    </NavButton>
                </div>
            </div>
        </>
    );
};
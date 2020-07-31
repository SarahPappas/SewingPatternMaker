import React, { useEffect } from 'react';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import './AddMeasurement.css';

interface AddMeasurementProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
}

export const AddMeasurement: React.FC<AddMeasurementProps> = ({ setUploadedFileData }) => {
    const instructModal: InstructModal = {text: ['Choose a path to measure.']};
    
    //const canvasContainerRef = useRef(document.querySelector<HTMLElement>('canvasContainer'));
    useEffect(() => {
        setUploadedFileData("");
    }, [setUploadedFileData]);

    return (
        <>
            <div className={'instructionsContainer'}>
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
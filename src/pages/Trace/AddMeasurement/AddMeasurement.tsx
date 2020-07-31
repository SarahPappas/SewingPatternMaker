import React from 'react';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import './Instructions.css';

export const AddMeasurement: React.FC = () => {
    const instructModal: InstructModal = {text: ['Choose a path to measure.']};
    
    return (
        <>
            <div className={'instructionsContainer'}>
                <InstructionModal instructModal={instructModal}></InstructionModal>
            </div>
        </>
    );
};
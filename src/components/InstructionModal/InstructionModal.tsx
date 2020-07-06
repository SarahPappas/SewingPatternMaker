import React from 'react';
import {Link, Route} from 'react-router-dom';
import './InstructionModal.css';

interface InstructModalProps {
    instructModal: InstructModal;
}

export const InstructionModal: React.FC<InstructModalProps> = ({ instructModal }) => {
    return (<>
        <div className='instructionModal'>
            {instructModal.text}
        </div>
    </>);
};
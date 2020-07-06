import React from 'react';
import {Link, Route} from 'react-router-dom';
import './InstructionModal.css';

interface InstructModalProps {
    instructModal: InstructModal;
}

export const InstructionModal: React.FC<InstructModalProps> = ({ instructModal }) => {
    const messages = instructModal.text.map((message) =>
        <div className='instructionItem'>{message}</div>
    );
    
    return (<>
        <div className='instructionModal'>
            {messages}
        </div>
    </>);
};
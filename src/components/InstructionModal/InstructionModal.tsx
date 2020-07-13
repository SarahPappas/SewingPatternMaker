import React from 'react';
import './InstructionModal.css';

interface InstructModalProps {
    instructModal: InstructModal;
}

export const InstructionModal: React.FC<InstructModalProps> = ({ instructModal }) => {
    const messages = instructModal.text.map((message, i) =>
        <div className='instructionItem' key={i}>{message}</div>
    );
    
    return (<>
        <div className='instructionModal'>
            {messages}
        </div>
    </>);
};
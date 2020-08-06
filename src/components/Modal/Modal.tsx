import React from 'react';
import './Modal.css';
import { ModalType } from 'canvas/Enums';

interface ModalProps {
    modal: Modal;
}

export const Modal: React.FC<ModalProps> = ({ modal }) => {
    let itemClassName = ""; 
    let modalClassName = "";
    switch(modal.type) {
        case ModalType.Instruction:
            itemClassName = 'instructionItem';
            modalClassName = 'instructionModal';
            break;
        case ModalType.Warning:
            itemClassName = 'warningItem';
            modalClassName = 'warningModal';
            break;
    }

    const messages = modal.text.map((message, i) =>
        <div className={itemClassName} key={i}>{message}</div>
    );
    
    return (<>
        <div className={modalClassName}>
            {messages}
        </div>
    </>);
};
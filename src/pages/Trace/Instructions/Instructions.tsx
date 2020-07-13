import React from 'react';
// import { ActionButton } from 'components/ActionButton/ActionButton';
import { NavButton } from 'components/NavButton/NavButton';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import './Instructions.css';

export const Instructions: React.FC = () => {
    const button: Button = {text: 'DONE', to: '/AddMeasurement' };
    const instruction: InstructModal = {text: ['Choose seam, fold, or edge to add to your pattern']};

    return (<>
        <div className={'backgroundGrey'}></div>
        <div className={'backgroundArrow'}></div>
        <NavButton button={button}/> 
        {/*<InstructionModal instructModal={instruction}/>*/}
    </>);
};
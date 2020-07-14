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
        <div className={'instructionsConatainer'}>
            <NavButton button={button}/> 
            <InstructionModal instructModal={instruction}/>
            <div className="flexGrid">
                <div className="col">
                    <div className={'arrow'}></div>
                    <div></div>
                </div>
                <div className="col">
                    <div className={'arrow'}></div>
                    <div></div>
                </div>  
                <div className="col">
                    <div className={'arrow'}></div>
                    <div></div>
                </div>
            </div>
        </div>
    </>);
};
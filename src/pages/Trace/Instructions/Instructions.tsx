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
            </div>
            <div className="flexGrid">
                <div className="col">
                    <div className={'arrow'}></div>
                    <div className={'seam'}>
                        <div className={'colorBlock'}></div>
                        <div className={'pathButtonLabel'}>Seam</div>
                    </div>
                    
                </div>
                <div className="col">
                    <div className={'arrow'}></div>
                    <div className={'fold'}>
                        <div className={'colorBlock'}></div>
                        <div className={'pathButtonLabel'}>Fold</div>
                    </div>
                </div>  
                <div className="col">
                    <div className={'arrow'}></div>
                    <div className={'edge'}>
                        <div className={'colorBlock'}></div>
                        <div className={'pathButtonLabel'}>Edge</div>
                    </div>
                </div>
            </div>
    </>);
};
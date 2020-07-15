import React from 'react';
// import { ActionButton } from 'components/ActionButton/ActionButton';
import { NavButton } from 'components/NavButton/NavButton';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import './Instructions.css';
import { PatternPathType } from 'canvas/Enums';

export const Instructions: React.FC = () => {
    const button: NavButton = {label: 'DONE', to: '/AddMeasurement' };
    const instruction: InstructModal = {text: ['Choose seam, fold, or edge to add to your pattern']};

    return (<>
        <div className={'backgroundGrey'}></div>
        <div className={'instructionsConatainer'}>
            {/* TODO: only show Done button when an enclosed shape exists */}
            <NavButton button={button}/> 
            <InstructionModal instructModal={instruction}/>
        </div>
        <PathTypeButtonGrid isEnabled={true} selectedType={PatternPathType.UNDEFINED}/>
    </>);
};
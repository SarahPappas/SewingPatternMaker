import React, { useRef, useEffect } from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import './Instructions.css';
import { PatternPathType } from 'canvas/Enums';

export const Instructions: React.FC = () => {
    const doneButton: NavButton = {label: 'DONE', to: '/AddMeasurement' };
    const addPathButton: NavButton = {label:'', to: 'AddPath'};
    const instruction: InstructModal = {text: ['Choose seam, fold, or edge to add to your pattern']};

    const canvasRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasRef.current.classList.add('canvasContainerBackground');
    }, [canvasRef]);
    
    return (<>
        <div className={'backgroundGrey'}></div>
        <div className={'instructionsConatainer'}>
            {/* TODO: only show Done button when an enclosed shape exists */}
            <NavButton button={doneButton}/> 
            <InstructionModal instructModal={instruction}/>
        </div>
        <div className='arrowFlexGrid'>
            <div className='arrowCol'>
                <div className='arrow'></div>
            </div>
            <div className='arrowCol'>
                <div className='arrow'></div>
            </div>  
            <div className='arrowCol'>
                <div className='arrow'></div>
            </div>
        </div>
        <NavButton button={addPathButton}>
            <PathTypeButtonGrid isEnabled={true} selectedType={PatternPathType.UNDEFINED} to={''}/>
        </NavButton>
    </>);
};
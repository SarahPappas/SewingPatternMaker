import React, { useRef, useEffect } from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import './Instructions.css';
import { PatternPathType } from 'canvas/Enums';

interface InstructionsProps {
    curPathType: PatternPathType;
    setPathType: React.Dispatch<React.SetStateAction<PatternPathType>>;
}

export const Instructions: React.FC<InstructionsProps> = ({curPathType, setPathType}) => {
    const doneButton: NavButton = {label: 'DONE', to: 'AddMeasurement' };
    const addPathButton: NavButton = {label:'', to: 'AddPath'};
    const instruction: InstructModal = {text: ['Choose seam, fold, or edge to add to your pattern']};

    const canvasRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        // Put the Canvas in the background.
        canvasRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasRef.current.classList.add('canvasContainerBackground');

        // Reset the path type.
        setPathType(PatternPathType.UNDEFINED);
    }, [canvasRef, curPathType, setPathType]);
    
    return (<>
        <div className={'backgroundGrey'}></div>
        <div className={'instructionsContainer'}>
            {/* TODO: Do not show the done button the first time we show instructions
                and check the path is enclosed */}
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
            <PathTypeButtonGrid isEnabled={true} curPathType={curPathType} setPathType={setPathType}/>
        </NavButton>
    </>);
};
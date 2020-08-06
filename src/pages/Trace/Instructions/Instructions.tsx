import React, { useRef, useEffect } from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { Modal as InstructionModal } from 'components/Modal/Modal';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import './Instructions.css';
import { PatternPathType, ModalType } from 'canvas/Enums';
import { globalDocument } from '../../../canvas/Document';
import { ActionButton } from 'components/ActionButton/ActionButton';

interface InstructionsProps {
    curPathType: PatternPathType;
    setPathType: React.Dispatch<React.SetStateAction<PatternPathType>>;
}

export const Instructions: React.FC<InstructionsProps> = ({curPathType, setPathType}) => {
    const doneButton: NavButton = {label: 'DONE', to: '/AddMeasurement' };
    const addPathButton: NavButton = {label:'', to: 'AddPath'};
    const instruction: Modal = {text: ['Choose seam, fold, or edge to add to your pattern'], type: ModalType.Instruction};
    const documentHasPath = globalDocument.isEmpty();


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
        <div className={'instructionsConatainer'}>
            {documentHasPath ? 
                <><NavButton button={doneButton}/> 
                    {/* {<ActionButton></ActionButton>} */}
                <NavButton button={doneButton}/></>
            : <></>}
            <InstructionModal modal={instruction}/>
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
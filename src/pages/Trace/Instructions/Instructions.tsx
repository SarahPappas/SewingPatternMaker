import React, { useRef, useEffect } from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { Modal } from 'components/Modal/Modal';
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
    const showNavButton: NavButton = {label: 'DONE', to: 'AddMeasurement' };
    const addPathButton: NavButton = {label:'', to: 'AddPath'};
    const warning: Modal = {text: ['Your pattern is incomplete. Please add another line.'], type: ModalType.Warning};
    const instruction: Modal = {text: ['Choose seam, fold, or edge to add to your pattern'], type: ModalType.Instruction};
    
    const [showWarning, setShowWarning] = React.useState<boolean>(false);
    let doneContainer = <></>;
    let showDoneButton = globalDocument.isEmpty();
    let arePatternsEnclosed = globalDocument.arePatternPiecesEnclosed();

    useEffect(() => {
        showDoneButton = globalDocument.isEmpty();
        arePatternsEnclosed = globalDocument.arePatternPiecesEnclosed();
    }, [arePatternsEnclosed, showDoneButton]);

    const handleClickDone = (): void => {
        console.log("click");
        setShowWarning(!globalDocument.arePatternPiecesEnclosed());
    };
    const showWarningButton: ActionButton = {label: 'DONE', action: handleClickDone};
    if (showDoneButton && !showWarning) {
        doneContainer = <ActionButton button={showWarningButton}></ActionButton>;
    }

    if (showDoneButton && arePatternsEnclosed) {
        doneContainer = <NavButton button={showNavButton}/>;
    }

    if (showWarning) {
        doneContainer =  <Modal modal={warning}/>;
    }

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
            {doneContainer }
            <div className={'alignBottom'}><Modal modal={instruction}/></div>
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
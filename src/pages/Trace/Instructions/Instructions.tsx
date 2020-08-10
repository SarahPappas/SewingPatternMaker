import React, { useRef, useEffect } from 'react';
import { AppModels } from '../../../canvas/App';
import { NavButton } from 'components/NavButton/NavButton';
import { Modal } from 'components/Modal/Modal';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import { PatternPathType, ModalType } from 'canvas/Enums';
import { ActionButton } from 'components/ActionButton/ActionButton';
import './Instructions.css';


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
    const showDoneButton = useRef(AppModels.document.isEmpty());
    const arePatternsEnclosed = useRef(AppModels.document.arePatternPiecesEnclosed());

    useEffect(() => {
        showDoneButton.current = AppModels.document.isEmpty();
        arePatternsEnclosed.current = AppModels.document.arePatternPiecesEnclosed();
    }, [arePatternsEnclosed, showDoneButton]);

    const handleClickDone = (): void => {
        setShowWarning(!AppModels.document.arePatternPiecesEnclosed());
    };
    const showWarningButton: ActionButton = {label: 'DONE', action: handleClickDone};
    if (showDoneButton.current && !showWarning) {
        doneContainer = <div className='navButton'><ActionButton button={showWarningButton}></ActionButton></div>;
    }

    if (showDoneButton.current && arePatternsEnclosed.current) {
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
            {doneContainer}
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
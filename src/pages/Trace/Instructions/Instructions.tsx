import React, { useRef, useEffect } from 'react';
import { App } from '../../../canvas/AppController';
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
    const navButton: Button = {label: 'DONE'};
    const addPathButton: Button = {label:''};
    const warning: Modal = {text: ['Your pattern is incomplete. Please add another line.'], type: ModalType.Warning};
    const instruction: Modal = {text: ['Choose seam, fold, or edge to add to your pattern'], type: ModalType.Instruction};
    
    const [showWarning, setShowWarning] = React.useState<boolean>(false);
    let doneContainer = <></>;
    const showDoneButton = useRef(App.document.isEmpty());
    const arePatternsEnclosed = useRef(App.document.arePatternPiecesEnclosed());

    useEffect(() => {
        showDoneButton.current = App.document.isEmpty();
        arePatternsEnclosed.current = App.document.arePatternPiecesEnclosed();
    }, [arePatternsEnclosed, showDoneButton]);

    const handleClickDone = (): void => {
        setShowWarning(!App.document.arePatternPiecesEnclosed());
    };

    const warningButton: Button = {label: 'DONE', className: 'navButton'};
    if (showDoneButton.current && !showWarning) {
        doneContainer = <ActionButton button={warningButton} action={handleClickDone}></ActionButton>;
    }

    if (showDoneButton.current && arePatternsEnclosed.current) {
        doneContainer = <NavButton button={navButton} to={'AddMeasurement'}/>;
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
        <NavButton button={addPathButton} to={'AddPath'}>
            <PathTypeButtonGrid isEnabled={true} curPathType={curPathType} setPathType={setPathType}/>
        </NavButton>
    </>);
};
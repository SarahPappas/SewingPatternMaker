import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { App } from '../../../canvas/AppController';
import { NavButton } from 'components/NavButton/NavButton';
import { Modal } from 'components/Modal/Modal';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import { PatternPathType, ModalType } from 'canvas/Enums';
import { ActionButton } from 'components/ActionButton/ActionButton';
import { UseBackButton } from 'components/UseBackButton/UseBackButton';
import './Instructions.css';


interface InstructionsProps {
    curPathType: PatternPathType;
    setPathType: React.Dispatch<React.SetStateAction<PatternPathType>>;
}

export const Instructions: React.FC<InstructionsProps> = ({curPathType, setPathType}) => {
    const navButton: Button = {label: 'DONE'};
    const addPathButton: Button = {label:''};
    const warning: Modal = {text: ['Your pattern is incomplete. Please add another line.', 'Your pattern will be complete when it is fully enclosed.'], type: ModalType.Warning};
    const instruction: Modal = {text: ['Choose seam, fold, or edge to add to your pattern'], type: ModalType.Instruction};
    
    const [showWarning, setShowWarning] = React.useState<boolean>(false);
    const doneContainer = useRef(<></>);
    const [showDoneButton, setShowDoneButton] = useState(false);
    const [arePatternsEnclosed, setArePatternsEnclosed] = useState(false);

    useEffect(() => {
        setShowDoneButton(!App.document.isEmpty());
        setArePatternsEnclosed(App.document.arePatternPiecesEnclosed());
    }, [arePatternsEnclosed, showDoneButton]);

    const handleClickDone = (): void => {
        setShowWarning(!App.document.arePatternPiecesEnclosed());
    };

    const warningButton: Button = {label: 'DONE', className: 'navButton'};
 
    if (showDoneButton && !showWarning) {
        doneContainer.current = <ActionButton button={warningButton} action={handleClickDone}></ActionButton>;
    }

    if (showDoneButton && arePatternsEnclosed) {
        doneContainer.current = <NavButton button={navButton} to={'AddMeasurement'}/>;
    }

    if (showWarning) {
        doneContainer.current =  <Modal modal={warning}/>;
    }

    const canvasRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        // Put the Canvas in the background.
        canvasRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasRef.current.classList.add('canvasContainerBackground');
    }, [canvasRef]);

    useEffect(() => {
        // Reset the path type.
        setPathType(PatternPathType.UNDEFINED);
    }, [setPathType]);

    const history = useHistory();
    const handleBackButton = () => {
        if (window.location.hash === "#/Trace/AddPath" ||
            window.location.hash === "#/Trace/Review")
        {
            if (confirm("Are you sure you want to go back? Going back will delete all of your work so far."))//eslint-disable-line no-restricted-globals
            {
                history.push('/AddPhoto');
            } else {
                history.push('/Trace/Instructions');
            }
        }
    };
    
    return (<>
        <div className={'backgroundGrey'}></div>
        <div className={'instructionsContainer'}>
            {doneContainer.current}
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
        <UseBackButton handler={handleBackButton}/>
    </>);
};
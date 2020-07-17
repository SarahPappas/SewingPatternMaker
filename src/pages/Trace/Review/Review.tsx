import React, { useRef, useEffect } from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import './Review.css';

export const Review: React.FC = () => {
    const keepButton: NavButton = {label: 'KEEP', to: '/Trace/Instructions' };
    // TODO: Delete button should dispatch event that removes the most recent path
    const deleteButton: NavButton = {label:'DELETE', to: '/Trace/Instructions'};

    const canvasRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasRef.current.classList.add('canvasContainerBackground');
    }, [canvasRef]);
    
    return (<>
        <div className={'backgroundGrey'}></div>
        <div className={'reviewButtonsConatainer'}>
            <NavButton button={keepButton}/> 
            <NavButton button={deleteButton}/> 
        </div>
    </>);
};
import React, { useRef, useEffect } from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { ActionButton } from 'components/ActionButton/ActionButton';
import { UseBackButton } from 'components/UseBackButton/UseBackButton';
import './Review.css';

export const Review: React.FC = () => {
    const keepButton: Button = {label: 'KEEP'};
    const deleteButtonNav: Button = {label:'DELETE'};

    const canvasContainerRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    const canvasRef = useRef(document.querySelector('canvas'));
    useEffect(() => {
        // Take the canvas out of the background.
        canvasContainerRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasContainerRef.current.classList.add('canvasContainerBackground');

        // Get the canvas element so that we can add an event listener.
        canvasRef.current = document.querySelector('canvas');
    }, [canvasContainerRef, canvasRef]);

    // Add event listener to remove the most recently added path.
    const removePath = new Event('removePath', {});
    const handleRemovePath = () => {
        canvasRef.current?.dispatchEvent(removePath);
    };
    const handleBackButton = () => {
        if (window.location.hash === "#/Trace/AddPath")
        {
            handleRemovePath();
        }
    };
    const deleteButtonAction: Button = {label: ''};
    
    return (<>
        <div className={'reviewButtonsConatainer'}>
            <NavButton button={keepButton} to={'/Trace/Instructions'}/>
            <ActionButton button={deleteButtonAction} action={handleRemovePath}>
                <NavButton button={deleteButtonNav} to='/Trace/Instructions'/>
            </ActionButton>
            <UseBackButton handler={handleBackButton}/>
        </div>
    </>);
};
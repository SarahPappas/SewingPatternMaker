import React, { useRef, useEffect } from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { ActionButton } from 'components/ActionButton/ActionButton';
import './Review.css';

export const Review: React.FC = () => {
    const keepButton: NavButton = {label: 'KEEP', to: '/Trace/Instructions' };
    const deleteButtonNav: NavButton = {label:'DELETE', to: '/Trace/Instructions'};

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
    const deleteButotonAction: ActionButton = {label: '', action: handleRemovePath};
    
    return (<>
        <div className={'reviewButtonsConatainer'}>
            <NavButton button={keepButton}/>
            <ActionButton button={deleteButotonAction}>
                <NavButton button={deleteButtonNav}/>
            </ActionButton>
        </div>
    </>);
};
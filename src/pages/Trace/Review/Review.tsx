import React, { useRef, useEffect } from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { ActionButton } from 'components/ActionButton/ActionButton';
import './Review.css';

export const Review: React.FC = () => {
    const keepButton: NavButton = {label: 'KEEP', to: '/Trace/Instructions' };
    // TODO: Delete button should dispatch event that removes the most recent path
    const deleteButtonNav: NavButton = {label:'DELETE', to: '/Trace/Instructions'};
    const deleteButotonAction: ActionButton = {label: '', action: () => {console.log('delete line!');   }};

    const canvasContainerRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasContainerRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasContainerRef.current.classList.add('canvasContainerBackground');
    }, [canvasContainerRef]);
    
    return (<>
        <div className={'reviewButtonsConatainer'}>
            <NavButton button={keepButton}/>
            <ActionButton button={deleteButotonAction}>
                <NavButton button={deleteButtonNav}/>
            </ActionButton>
        </div>
    </>);
};
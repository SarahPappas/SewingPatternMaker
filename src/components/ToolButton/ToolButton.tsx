import React, { useRef, useEffect, ReactComponentElement } from 'react';
import { PatternPathType, ToolType } from 'canvas/Enums';
import { ActionButton } from 'components/ActionButton/ActionButton';
import './ToolButton.css';

interface ToolButtonProps {
    curPathType: PatternPathType;
    toolType: ToolType;
    selectedType: ToolType;
}

export const ToolButton: React.FC<ToolButtonProps> = ( props ) => {    
    const canvasRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasRef.current = document.getElementsByClassName('canvasContainer')[0];
    }, [canvasRef]);

    // Setup props for action button.
    const handleSetTool = () => {
        // TODO: use to set selectedType state

    };

    const button = {label:"", action:handleSetTool};


    return (
        <ActionButton button={button}>
            <div className='toolContainer'>
                {props.children}
            </div>
        </ActionButton>  
    );
};
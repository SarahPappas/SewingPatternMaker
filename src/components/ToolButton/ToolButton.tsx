import React, { useRef, useEffect } from 'react';
import { PatternPathType, ToolType } from 'canvas/Enums';
import { ActionButton } from 'components/ActionButton/ActionButton';
import './ToolButton.css';

interface ToolButtonProps {
    toolType: ToolType;
    selectedType: ToolType;
    setSelectedType: React.Dispatch<React.SetStateAction<ToolType>>;
}

export const ToolButton: React.FC<ToolButtonProps> = ( {toolType, selectedType, setSelectedType, ...props }) => {    
    const setCanvasToolType = new CustomEvent('setToolType', {
        detail: { toolType: toolType }
    });

    const canvasRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasRef.current = document.getElementsByClassName('canvasContainer')[0];
    }, [canvasRef]);

    let toolBorder = {};
    if (selectedType === toolType) {
        toolBorder = {
            'border': '#707070 dashed .5px',
            'border-radius': '15px'
        };
    }

    const handleSetTool = () => {
        setSelectedType(toolType);
        canvasRef.current?.dispatchEvent(setCanvasToolType);
    };

    const button = {label:"", action:handleSetTool};

    return (
        <ActionButton button={button}>
            <div className='toolContainer' style={toolBorder}>
                {props.children}
            </div>
        </ActionButton>  
    );
};
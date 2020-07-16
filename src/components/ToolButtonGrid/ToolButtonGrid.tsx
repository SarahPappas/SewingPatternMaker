import React, { useRef, useEffect } from 'react';
import { PatternPathType } from 'canvas/Enums';
import { ReactComponent as FreeLineToolIcon } from '../../../assets/free-line-tool.svg';
import { ReactComponent as StraightLineToolIcon } from '../../../assets/straight-line-tool.svg';
import { PatternPathColor } from 'canvas/PatternPathColor';
import { ActionButton } from 'components/ActionButton/ActionButton';
import './AddPath.css';

interface ToolButtonGridProps {
    curPathType: PatternPathType;
}

export const ToolButtonGrid: React.FC<ToolButtonGridProps> = ({curPathType}) => {
    const canvasRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasRef.current = document.getElementsByClassName('canvasContainer')[0];
    }, [canvasRef]);

    // Sets the correct color for the svg path icon.
    let iconStyle = {};
    if (curPathType) {
        iconStyle = {
            stroke: PatternPathColor.get(curPathType)
        };
    }

    // Setup props for action button.
    const handleSetTool = () => {

    };

    let button = {label:"", action:handleSetTool};
    
    // Do not show free line tool if path type is a fold.
    let freeLineTool = <></>;
    if (curPathType !== PatternPathType.Fold) {
        freeLineTool =
            <ActionButton button={button}>
                <div className='toolContainer'>
                    <FreeLineToolIcon style={iconStyle} />
                </div>
            </ActionButton>;
    }

    return (
        <div className='toolBar'>
            <ActionButton button={button}>
                <div className='toolContainer' >
                    <StraightLineToolIcon style={iconStyle} />
                </div>
            </ActionButton>  
            {freeLineTool}
        </div>
    );
};
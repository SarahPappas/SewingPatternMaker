import React, { useRef, useEffect } from 'react';
import { PatternPathType, ToolType } from 'canvas/Enums';
import { ReactComponent as FreeLineToolIcon } from '../../assets/free-line-tool.svg';
import { ReactComponent as StraightLineToolIcon } from '../../assets/straight-line-tool.svg';
import {PatternPathColor} from 'canvas/PatternPathColor';
import { ToolButton } from 'components/ToolButton/ToolButton';
import './ToolButtonGrid.css';

interface ToolButtonGridProps {
    curPathType: PatternPathType;
}

export const ToolButtonGrid: React.FC<ToolButtonGridProps> = ({curPathType}) => {
    // By default the line tool should be selected
    const toolType = ToolType.StraightLine;

    const selectedType = ToolType.StraightLine;
        
    // Do not show free line tool if path type is a fold.
    let freeLineTool = <></>;
    const iconStyle = {
        stroke: PatternPathColor.get(curPathType)
    };

    if (curPathType !== PatternPathType.Fold) {
        freeLineTool =
            <ToolButton curPathType={curPathType} toolType={ToolType.Freeline} selectedType={selectedType}>
                <FreeLineToolIcon style={iconStyle}></FreeLineToolIcon>
            </ToolButton>;
    }

    return (
        <div className='toolBar'>
            <ToolButton curPathType={curPathType} toolType={ToolType.StraightLine} selectedType={selectedType}>
                <StraightLineToolIcon style={iconStyle}></StraightLineToolIcon>
            </ToolButton>
            {freeLineTool}
        </div>
    );
};
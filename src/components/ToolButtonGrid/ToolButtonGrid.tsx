import React from 'react';
import { PatternPathType, ToolType } from 'canvas/Enums';
import { ReactComponent as FreeLineToolIcon } from '../../assets/free-line-tool.svg';
import { ReactComponent as StraightLineToolIcon } from '../../assets/straight-line-tool.svg';
import { PatternPathColor} from 'canvas/PatternPaths/PatternPathColor';
import { ToolButton } from 'components/ToolButton/ToolButton';
import './ToolButtonGrid.css';

interface ToolButtonGridProps {
    curPathType: PatternPathType;
}

export const ToolButtonGrid: React.FC<ToolButtonGridProps> = ({curPathType}) => {
    // By default the line tool should be selected
    const [selectedToolType, setSelectedToolType] = React.useState<ToolType>(ToolType.StraightLine);
    
    // Set the icon color.
    const iconStyle = {
        stroke: PatternPathColor.get(curPathType)
    };

    // Do not show free line tool if path type is a fold.
    let freeLineTool = <></>;
    if (curPathType !== PatternPathType.Fold) {
        freeLineTool =
            <ToolButton toolType={ToolType.Freeline} selectedType={selectedToolType} setSelectedType={setSelectedToolType}>
                <FreeLineToolIcon style={iconStyle}></FreeLineToolIcon>
            </ToolButton>;
    }

    return (
        <div className='toolBar'>
            <ToolButton toolType={ToolType.StraightLine} selectedType={selectedToolType} setSelectedType={setSelectedToolType}>
                <StraightLineToolIcon style={iconStyle}></StraightLineToolIcon>
            </ToolButton>
            {freeLineTool}
        </div>
    );
};
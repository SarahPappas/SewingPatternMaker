import React, { useRef, useEffect } from 'react';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import { PatternPathType } from 'canvas/Enums';
import { ReactComponent as FreeLineToolIcon } from '../../../assets/free-line-tool.svg';
import { ReactComponent as StraightLineToolIcon } from '../../../assets/straight-line-tool.svg';
import { PatternPathColor } from 'canvas/PatternPathColor';
import './AddPath.css';

interface AddPathProps {
    curPathType: PatternPathType;
    setPathType: React.Dispatch<React.SetStateAction<PatternPathType>>;
}

export const AddPath: React.FC<AddPathProps> = ({curPathType, setPathType}) => {
    const canvasRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasRef.current.classList.remove('canvasContainerBackground');
    }, [canvasRef]);

    // Sets the correct color for the svg path icon 
    let iconStyle = {};
    if (curPathType) {
        iconStyle = {
            stroke: PatternPathColor.get(curPathType)
        };
    }
    
    // Do not show free line tool if path type is a fold.
    let freeLineTool = <></>;
    if (curPathType !== PatternPathType.Fold) {
        freeLineTool = <>
            <div className='toolContainer'>
                <FreeLineToolIcon style={iconStyle} />
            </div>
        </>;
    }

    return (<>
        <div className='toolBar'>
            <div className='toolContainer' >
                <StraightLineToolIcon style={iconStyle} />
            </div>
            {freeLineTool}
        </div>
        <PathTypeButtonGrid isEnabled={false} curPathType={curPathType} setPathType={setPathType}/>
    </>);
};
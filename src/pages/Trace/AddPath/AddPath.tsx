import React, { useRef, useEffect } from 'react';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import { PatternPathType } from 'canvas/Enums';
import { ReactComponent as FreeLineToolIcon } from '../../../assets/free-line-tool.svg';
import { PatternPathColor } from 'canvas/PatternPathColor';

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

    let iconStyle = {};
    if (curPathType) {
        iconStyle = {
            stroke: PatternPathColor.get(curPathType)
        };
    }

    return (<>
        <div className='toolBar'>
            <div className='toolContainer'>
                <FreeLineToolIcon style={iconStyle} />
            </div>
            <div className='toolContainer'></div>
        </div>
        <PathTypeButtonGrid isEnabled={false} curPathType={curPathType} setPathType={setPathType}/>
    </>);
};
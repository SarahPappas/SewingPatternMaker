import React, { useRef, useEffect } from 'react';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import { PatternPathType } from 'canvas/Enums';
import{ ToolButtonGrid } from 'components/ToolButtonGrid/ToolButtonGrid';

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

    return (<>
        <ToolButtonGrid curPathType={curPathType}/>
        <PathTypeButtonGrid isEnabled={false} curPathType={curPathType} setPathType={setPathType}/>
    </>);
};
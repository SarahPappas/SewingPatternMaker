import React, { useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import { PatternPathType } from 'canvas/Enums';
import{ ToolButtonGrid } from 'components/ToolButtonGrid/ToolButtonGrid';

interface AddPathProps {
    curPathType: PatternPathType;
    setPathType: React.Dispatch<React.SetStateAction<PatternPathType>>;
}

export const AddPath: React.FC<AddPathProps> = ({curPathType, setPathType}) => {
    const canvasRef = useRef(document.querySelector('canvas'));
    useEffect(() => {
        canvasRef.current = document.querySelector('canvas');
    }, [canvasRef]);
    
    const history = useHistory();

    canvasRef.current?.addEventListener("endPath", () => {
        history.push('/Review');
    });

    return (<>
        <ToolButtonGrid curPathType={curPathType}/>
        <PathTypeButtonGrid isEnabled={false} curPathType={curPathType} setPathType={setPathType}/>
    </>);
};
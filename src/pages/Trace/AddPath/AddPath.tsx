import React, { useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import { PatternPathType } from 'canvas/Enums';
import { ToolButtonGrid } from 'components/ToolButtonGrid/ToolButtonGrid';

interface AddPathProps {
    curPathType: PatternPathType;
    setPathType: React.Dispatch<React.SetStateAction<PatternPathType>>;
}

export const AddPath: React.FC<AddPathProps> = ({curPathType, setPathType}) => {
    // Remove class that puts canvas in the background.
    const canvasContainerRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasContainerRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasContainerRef.current.classList.remove('canvasContainerBackground');
    }, [canvasContainerRef]);

    // Get the Canvas so that we can and an event listener to it.
    const canvasRef = useRef(document.querySelector('canvas'));
    useEffect(() => {
        canvasRef.current = document.querySelector('canvas');
    }, [canvasRef]);
    
    const history = useHistory();

    canvasRef.current?.addEventListener("endTracing", () => {
        history.push('/Trace/Review');
    });

    return (<>
        <ToolButtonGrid curPathType={curPathType}/>
        <PathTypeButtonGrid isEnabled={false} curPathType={curPathType} setPathType={setPathType}/>
    </>);
};
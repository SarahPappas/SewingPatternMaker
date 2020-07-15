import React, { useRef, useEffect } from 'react';
import { PathTypeButtonGrid } from 'components/PathTypeButtonGrid/PathTypeButtonGrid';
import { PatternPathType } from 'canvas/Enums';

export const AddPath: React.FC = () => {
    const canvasRef = useRef(document.getElementsByClassName('canvasContainer')[0]);
    useEffect(() => {
        canvasRef.current = document.getElementsByClassName('canvasContainer')[0];
        canvasRef.current.classList.remove('canvasContainerBackground');
    }, [canvasRef]);

    return (<>
        <PathTypeButtonGrid isEnabled={false} selectedType={PatternPathType.UNDEFINED} to={''}/>
    </>);
};
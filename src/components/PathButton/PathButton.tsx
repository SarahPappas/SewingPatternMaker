import React, { useEffect, useRef } from 'react';
import './PathButton.css';
import { PatternPathType } from 'canvas/Enums';
 import { ActionButton } from 'components/ActionButton/ActionButton';

interface PathButtonProps {
    type: PatternPathType;
}

export const PathButton: React.FC<PathButtonProps> = ({type}) => {
    const typeName = PatternPathType[type];
    const className = typeName.toLowerCase();
    const setPathType = new CustomEvent('setPathType', {
        detail: { pathType: type }
    });

    const canvasRef = useRef(document.querySelector('canvas'));
    useEffect(() => {
        canvasRef.current = document.querySelector('canvas');
    }, [canvasRef]);
    

    const handleSetPathType = () => {
        canvasRef.current?.dispatchEvent(setPathType);
    };

    const buttonProps = {label: typeName, action: handleSetPathType};
    return (<>
        <ActionButton button={buttonProps}>
            <div className={className}>
                <div className={'colorBlock'}></div>
                <div className={'pathButtonLabel'}>{typeName}</div>
            </div>
        </ActionButton>
    </>);
};
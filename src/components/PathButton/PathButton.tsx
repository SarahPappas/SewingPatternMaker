import React, { useEffect } from 'react';
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

    let canvasEl: HTMLCanvasElement | null = null;
    useEffect(() => {
        canvasEl = document.querySelector('canvas');
    }, [canvasEl]);
    

    const handleSetPathType = () => {
        canvasEl?.dispatchEvent(setPathType);
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
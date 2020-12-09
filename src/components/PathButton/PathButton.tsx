import React, { useEffect, useRef } from 'react';
import './PathButton.css';
import { PatternPathType } from 'canvas/Enums';
import { ActionButton } from 'components/ActionButton/ActionButton';

interface PathButtonProps {
    type: PatternPathType;
    isEnabled: boolean;
    curPathType: PatternPathType;
    setPathType: React.Dispatch<React.SetStateAction<PatternPathType>>;
}

export const PathButton: React.FC<PathButtonProps> = ({type, isEnabled, curPathType, setPathType}) => {
    const typeName = PatternPathType[type];
    const className = typeName.toLowerCase();
    const setCanvasPathType = new CustomEvent('setPathType', {
        detail: { pathType: type }
    });

    const canvasRef = useRef(document.querySelector('canvas'));
    useEffect(() => {
        canvasRef.current = document.querySelector('canvas');
    }, [canvasRef]);
    
    const handleSetPathType = () => {
        if (!isEnabled) {
            return;
        }

        setPathType(type);
        canvasRef.current?.dispatchEvent(setCanvasPathType);
    };

    let buttonLabelClass = 'pathButtonLabel';
    buttonLabelClass = (curPathType && curPathType !== type) ? buttonLabelClass + ' notActive' : buttonLabelClass;

    const buttonProps = {label: typeName};
    return (<>
        <ActionButton button={buttonProps} action={handleSetPathType}>
            <div className={className}>
                <div className='colorBlock'></div>
                <div className={buttonLabelClass}>{typeName}</div>
            </div>
        </ActionButton>
    </>);
};
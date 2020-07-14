import React from 'react';
import './PathButton.css';
import { PatternPathType } from 'canvas/Enums';
 import { ActionButton } from 'components/ActionButton/ActionButton';

interface PathButtonProps {
    type: PatternPathType;
}

export const PathButton: React.FC<PathButtonProps> = ({type}) => {
    const typeName = PatternPathType[type];
    const className = typeName.toLowerCase();

    const setPathType = () => {
        console.log("path set");
    };

    const buttonProps = {label: typeName, action: setPathType};
    return (<>
        <ActionButton button={buttonProps}>
            <div className={className}>
                <div className={'colorBlock'}></div>
                <div className={'pathButtonLabel'}>{typeName}</div>
            </div>
        </ActionButton>
    </>);
};
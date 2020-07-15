import React from 'react';
import './PathTypeButtonGrid.css';
import { PathButton } from 'components/PathButton/PathButton';
import { PatternPathType } from 'canvas/Enums';

interface PathTypeButtonGridProps {
    isEnabled: boolean;
    selectedType: PatternPathType;
}

export const PathTypeButtonGrid: React.FC<PathTypeButtonGridProps> = ({isEnabled, selectedType}) => {
    return (
        <div className="flexGrid">
            <div className="col">
                <div className={'arrow'}></div>
                <PathButton type={PatternPathType.Seam} isEnabled={isEnabled}/>
            </div>
            <div className="col">
                <div className={'arrow'}></div>
                <PathButton type={PatternPathType.Fold} isEnabled={isEnabled}/>
            </div>  
            <div className="col">
                <div className={'arrow'}></div>
                <PathButton type={PatternPathType.Edge} isEnabled={isEnabled}/>
            </div>
        </div>
    );
};
import React from 'react';
import './PathTypeButtonGrid.css';
import { PathButton } from 'components/PathButton/PathButton';
import { PatternPathType } from 'canvas/Enums';

interface PathTypeButtonGridProps {
    isEnabled: boolean;
    curPathType: PatternPathType;
    setPathType: React.Dispatch<React.SetStateAction<PatternPathType>>;
}

export const PathTypeButtonGrid: React.FC<PathTypeButtonGridProps> = ({isEnabled, curPathType, setPathType}) => {
    return (
        <div className="flexGrid">
            <div className="col">
                <PathButton type={PatternPathType.Seam} isEnabled={isEnabled} curPathType={curPathType} setPathType={setPathType}/>
            </div>
            <div className="col">
                <PathButton type={PatternPathType.Fold} isEnabled={isEnabled} curPathType={curPathType} setPathType={setPathType}/>
            </div>  
            <div className="col">
                <PathButton type={PatternPathType.Edge} isEnabled={isEnabled} curPathType={curPathType} setPathType={setPathType}/>
            </div>
        </div>
    );
};
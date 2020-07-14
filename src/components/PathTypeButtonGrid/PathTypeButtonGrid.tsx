import React from 'react';
import './PathTypeButtonGrid.css';
import { PathButton } from 'components/PathButton/PathButton';
import { PatternPathType } from 'canvas/Enums';

export const PathTypeButtonGrid: React.FC = () => {
    return (
        <div className="flexGrid">
            <div className="col">
                <div className={'arrow'}></div>
                <PathButton type={PatternPathType.Seam}></PathButton>
            </div>
            <div className="col">
                <div className={'arrow'}></div>
                <PathButton type={PatternPathType.Fold}></PathButton>
            </div>  
            <div className="col">
                <div className={'arrow'}></div>
                <PathButton type={PatternPathType.Edge}></PathButton>
            </div>
        </div>
    );
};
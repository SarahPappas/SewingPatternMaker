import React from 'react';
import './NavButton.css';
import { canvasElement } from './Canvas'

interface LoadButtonProps {

}

export const LoadButton: React.FC<LoadButtonProps> = () => {    
    return (
        <div style={{textAlign: 'center',}}>
            <button className='navButton' onClick={() => {
                canvasElement.width = 500 
                canvasElement.height = 500
            }}>
                <div className='label'> 
                    Load
                </div>
            </button>
        </div>
    );
}
import React from 'react';
import './NavButton.css';

interface NavButtonProps {
    button: Button;
}

export const NavButton: React.FC<NavButtonProps> = ({ button }) => {
    return <div className='navButton'>
        <div className='label'> 
            {button.text}
        </div>
    </div>
}
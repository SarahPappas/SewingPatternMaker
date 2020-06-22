import React from 'react';
import {Link} from 'react-router-dom';
import './NavButton.css';

interface NavButtonProps {
    button: Button;
}

export const NavButton: React.FC<NavButtonProps> = ({ button }) => {
    return <Link to=''>
        <div className='navButton'>
            <div className='label'> 
                {button.text}
            </div>
        </div>
    </Link>
}
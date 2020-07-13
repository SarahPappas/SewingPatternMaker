import React from 'react';
import {Link, Route} from 'react-router-dom';
import './NavButton.css';

interface NavButtonProps {
    button: NavButton;
}

export const NavButton: React.FC<NavButtonProps> = ({ button }) => {
    return (<>
        <Link to={button.to}>
             <div className='navButton'>
                 <div className='label'> 
                     {button.text}
                 </div>
             </div>
        </Link>
        <Route exact path={button.to} />
    </>);
};
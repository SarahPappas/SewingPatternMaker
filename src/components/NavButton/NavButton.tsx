import React from 'react';
import {Link, Route} from 'react-router-dom';
import {Button} from 'components/Button/Button';
import './NavButton.css';

interface NavButtonProps {
    button: NavButton;
}

export const NavButton: React.FC<NavButtonProps> = ({ button }) => {    
    return (<>
        <Link to={button.to}>
             <Button label={button.label} className='navButton'></Button>
        </Link>
        <Route exact path={button.to} />
    </>);
};
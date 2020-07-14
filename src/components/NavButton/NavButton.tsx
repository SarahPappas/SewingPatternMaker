import React from 'react';
import {Link, Route} from 'react-router-dom';
import {Button} from 'components/Button/Button';
import './NavButton.css';

interface NavButtonProps {
    button: NavButton;
}

export const NavButton: React.FC<NavButtonProps> = ({ button }) => {
    const buttonProps: Button = {label: button.label, className: 'navButton'};
    
    return (<>
        <Link to={button.to}>
             <Button button={buttonProps}></Button>
        </Link>
        <Route exact path={button.to} />
    </>);
};
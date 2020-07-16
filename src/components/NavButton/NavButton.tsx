import React from 'react';
import {Link, Route} from 'react-router-dom';
import {Button} from 'components/Button/Button';
import './NavButton.css';

interface NavButtonProps {
    button: NavButton;
}

export const NavButton: React.FC<NavButtonProps> = ( props ) => {    
    const hasChildren = React.Children.count(props.children);

    if (hasChildren) {
        return (<>
            <Link to={props.button.to}>
                {props.children}
            </Link>
            <Route exact path={props.button.to} />
        </>);
    } else {
        return (<>
            <Link to={props.button.to}>
                <Button label={props.button.label} className='navButton'></Button>
            </Link>
            <Route exact path={props.button.to} />
        </>);
    }



};
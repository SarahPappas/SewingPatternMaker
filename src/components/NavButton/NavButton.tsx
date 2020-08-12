import React from 'react';
import {Link, Route} from 'react-router-dom';
import {Button} from 'components/Button/Button';
import './NavButton.css';

interface NavButtonProps {
    button: Button;
    to: string;
}

export const NavButton: React.FC<NavButtonProps> = ( props ) => {    
    const hasChildren = React.Children.count(props.children);
    let className = 'navButton';
    if (props.button.className) {
        className = className + ' ' + props.button.className;
    }

    if (hasChildren) {
        return (<>
            <Link to={props.to}>
                {props.children}
            </Link>
            <Route exact path={props.to} />
        </>);
    } else {
        return (<>
            <Link to={props.to}>
                <Button label={props.button.label} className={className}></Button>
            </Link>
            <Route exact path={props.to} />
        </>);
    }



};
import React from 'react';
import {Button} from 'components/Button/Button';
import './ActionButton.css';

interface ActionButtonProps {
    button: Button;
    action: (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const ActionButton: React.FC<ActionButtonProps> = (props) => {    
    const hasChildren = React.Children.count(props.children);

    if (hasChildren) {
        return (
            <div onPointerDown={(e) => {props.action();}} className={props.button.className}>
                {props.children}
            </div>
        );
    } else {
        return(
            <div onPointerDown={(e) => {props.action();}} className={props.button.className}>
                <Button label={props.button.label} className='actionButton'></Button>
            </div>
        );
    }
};
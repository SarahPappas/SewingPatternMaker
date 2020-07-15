import React from 'react';
import {Button} from 'components/Button/Button';
import './ActionButton.css';

interface ActionButtonProps {
    button: ActionButton;
}

export const ActionButton: React.FC<ActionButtonProps> = (props) => {    
    const hasChildren = React.Children.count(props.children);

    if (hasChildren) {
        return (
            <div onClick={props.button.action}>
                {props.children}
            </div>
        );
    } else {
        return(
            <div onClick={props.button.action}>
                <Button label={props.button.label} className='actionButton'></Button>
            </div>
        );
    }
};
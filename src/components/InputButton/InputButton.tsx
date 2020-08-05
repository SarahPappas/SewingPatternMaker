import React from 'react';
import { Button } from 'components/Button/Button';
import './InputButton.css';

interface InputButtonProps {
    button?: ActionButton;
    input: Input;
}

export const InputButton: React.FC<InputButtonProps> = ({ button, input }) => {    
    let optionalButton = <></>;

    let onChange = (): void => {
        console.log('onchange');
    };

    if (button) {
        optionalButton = (
            <label htmlFor={input.id} className={input.className}> 
                <Button label={button.label} className=''></Button>
            </label>
        );
        onChange = button.action;
    }

    return (<>
        <input id={input.id} type={input.type} accept={input.accept} onChange={onChange} multiple={false}/>
        {optionalButton}        
    </>);
};
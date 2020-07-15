import React from 'react';
import { Button } from 'components/Button/Button';
import './InputButton.css';

interface InputButtonProps {
    button: ActionButton;
    input: Input;
}

export const InputButton: React.FC<InputButtonProps> = ({ button, input }) => {    

    return (<>
        <input id={input.id} type={input.type} accept={input.accept} onChange={button.action} multiple={false}/>

        <label htmlFor={input.id} className={input.className}> 
        <Button label={button.label} className=''></Button>
        </label>
    </>);
};
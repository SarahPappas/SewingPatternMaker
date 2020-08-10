import React from 'react';
import { Button } from 'components/Button/Button';
import './Input.css';

interface InputButtonProps {
    input: Input;
    button?: Button;
}

export const Input: React.FC<InputButtonProps> = ({ input, button }) => {    
    let optionalButton = <></>;

    if (button) {
        optionalButton = (
            <label htmlFor={input.id}> 
                <Button 
                    label={button.label} 
                    className={button.className}>
                </Button>
            </label>
        );
    }

    return (<>
        <input 
            id={input.id} 
            type={input.type} 
            accept={input.accept} 
            onChange={input.onChange} 
            className={input.className} 
            multiple={false}
        />
        {optionalButton}        
    </>);
};
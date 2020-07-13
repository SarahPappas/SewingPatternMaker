import React from 'react';
import {Link, Route} from 'react-router-dom';
import './ActionButton.css';

interface ActionButtonProps {
    button: Button;
    action: () => any;
    input: Input | null;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ button, action, input }) => {
    const buttonLabel = <> 
        <div className='label'> 
            {button.text}
        </div>
    </>

    return (<>
        if ({input}) {
            <>
                <input id={input?.id} type={input?.type} accept={input?.accept} onChange={action} multiple={false}/>

                <label htmlFor={input?.id} className={input?.class}>
                    {buttonLabel}
                </label>
            </>

        } else {
            <div className='actionButton' onClick= {action}>
                {buttonLabel}
            </div>
        }
    </>);
};
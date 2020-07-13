import React from 'react';
import './ActionButton.css';

interface ActionButtonProps {
    text: string;
    action: (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
    input?: Input;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ text, action, input }) => {    
    const buttonLabel = <> 
        <div className='label'> 
            {text}
        </div>
    </>;

    const hasInput = Boolean({input});

    if (hasInput) {
        return (<>
            <input id={input?.id} type={input?.type} accept={input?.accept} onChange={action} multiple={false}/>

            <label htmlFor={input?.id} className={input?.className}> 
                {buttonLabel}
            </label>
        </>);
    } else {
        return(<>
            <div className='actionButton' onClick= {action}>
                {buttonLabel}
            </div>
        </>);
    }
};
import React, { FormEvent } from 'react';
import './NavButton.css';

interface NavButtonProps {
    button: Button;
    wrapped: Boolean;
    setWrap: any;
}

export const NavButton: React.FC<NavButtonProps> = ({ button, setWrap, wrapped }) => {    
    const toggleWrap = (e: FormEvent<HTMLButtonElement>) => {
        setWrap(!wrapped);
    }

    const displayWrapped = (wrapped: Boolean) => {
        return wrapped ? "Unwrap" : "Wrap";
    }
    
    return (
        <div style={{textAlign: 'center',}}>
            <button onClick={toggleWrap} className='navButton'>
                <div className='label'> 
                    {displayWrapped(wrapped) + button.text}
                </div>
            </button>
        </div>
    );
}
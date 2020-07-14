import React from 'react';

interface NavButtonProps {
    button: Button;
}

export const Button: React.FC<NavButtonProps> = ({ button }) => {
    return (
        <div className={button.className}>
            <div className='label'> 
                {button.label}
            </div>
        </div>
    );
};
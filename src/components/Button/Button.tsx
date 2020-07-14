import React from 'react';

interface ButtonProps {
    label: string;
    className: string;
}

export const Button: React.FC<ButtonProps> = ({ label, className }) => {
    return (
        <div className={className}>
            <div className='label'> 
                {label}
            </div>
        </div>
    );
};
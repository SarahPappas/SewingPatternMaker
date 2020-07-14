import React from 'react';

interface NavButtonProps {
    label: string;
    className: string;
}

export const Button: React.FC<NavButtonProps> = ({ label, className }) => {
    return (
        <div className={className}>
            <div className='label'> 
                {label}
            </div>
        </div>
    );
};
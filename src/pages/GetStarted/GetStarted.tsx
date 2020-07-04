import React from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import './GetStarted.css';

const button: Button = {text: "Get Started", to: "/AddPhoto" };

export const GetStarted: React.FC = () => {
    return (
        <div className={'getStartedContainer'}>
            <NavButton button={button}/>
        </div>
    );
};
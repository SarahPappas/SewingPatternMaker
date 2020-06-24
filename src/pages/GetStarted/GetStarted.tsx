import React from 'react';
import { NavButton } from 'components/NavButton/NavButton';

const button: Button = {text: "Get Started", to: "/AddPhoto" };

export const GetStarted: React.FC = () => {
    return (
        <NavButton button={button}/>
    );
}
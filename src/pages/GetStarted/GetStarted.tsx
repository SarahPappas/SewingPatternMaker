import React from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import './GetStarted.css';

const button: Button = {text: "GET STARTED", to: "/AddPhoto" };
const intro: InstructModal = {text: "Let’s Make a \npattern in 3 \nsteps"};
const steps: InstructModal = {text: "1. Upload photo\r\n2. Trace pattern\r\n3. Print pdf"};


export const GetStarted: React.FC = () => {
    return (
        <div className={'getStartedContainer'}>
            <InstructionModal instructModal={intro}/>
            <InstructionModal instructModal={steps}/>
            <NavButton button={button}/>
        </div>
    );
};
import React from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { InstructionModal } from 'components/InstructionModal/InstructionModal';
import backgroundArrow from '../../assets/background-arrow.svg';
import './GetStarted.css';

const button: Button = {text: "GET STARTED", to: "/AddPhoto" };
const intro: InstructModal = {text: ["Let’s Make a \npattern in 3 \nsteps"]};
const steps: InstructModal = {text: ["1. Upload photo", "2. Trace pattern", "3. Print pdf"]};

export const GetStarted: React.FC = () => {
    return (<>
        <div className={'backgroundImageTop'}></div>
        <img className={'backgroundImageBottom'} src={backgroundArrow} alt='down arrow'></img>
        <div className={'getStartedContainer'}> 
            <InstructionModal instructModal={intro}/>
            <div className={'introSteps'}><InstructionModal instructModal={steps}/></div>
            <NavButton button={button}/>
        </div>  
    </>);
};
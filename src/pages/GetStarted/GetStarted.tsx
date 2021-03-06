import React from 'react';
import { NavButton } from 'components/NavButton/NavButton';
import { Modal as InstructionModal } from 'components/Modal/Modal';
import backgroundArrow from '../../assets/background-arrow-grey.svg';
import './GetStarted.css';
import { ModalType } from 'canvas/Enums';

export const GetStarted: React.FC = () => {
    const button: Button = {label: "GET STARTED"};
    const intro: Modal = {text: ["Let’s Make a \npattern in 3 \nsteps"], type: ModalType.Instruction};
    const steps: Modal = {text: ["1. Upload photo", "2. Trace pattern", "3. Print pdf"], type: ModalType.Instruction};

    return (<>
        <div className={'backgroundImageTop'}></div>
        <img className={'backgroundImageBottom'} src={backgroundArrow} alt='down arrow'></img>
        <InstructionModal modal={intro}/>
        <div className={'introSteps'}><InstructionModal modal={steps}/></div>
        <NavButton button={button} to={'/AddPhoto'}/> 
    </>);
};
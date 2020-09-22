import React from 'react';
import { App } from 'canvas/AppController';
import { ActionButton } from 'components/ActionButton/ActionButton';
import { Modal } from 'components/Modal/Modal';
import { ModalType } from 'canvas/Enums';
import './Export.css';

export const Export: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showExportButton, setExport] = React.useState<boolean>(true);

    // Generating the pdf takes time, so we are using an async call to not block the main js thread.
    let loader;
    if (loading) {
        loader = <div className={'lds-hourglass'}/>; 
    } else {
        loader = <div />;
    }
    
    const handleClick = () => {
        setExport(false);
        console.log("loading? ", loading);
        if (loading) {
            return;
        }

        setLoading(true);

        setTimeout(() => {
            App.exporter.save();
            setLoading(false);
        }, 0);
    };

    const exportButton: Button = {label: 'EXPORT PDF', className: 'navButton'};
    const thanksMessage: Modal = {text: ['Your pattern has been downloaded'], type: ModalType.Instruction};
    return (<>
        <div>
            {loader}
            <div style={{display: showExportButton ? 'block' : 'none'}}>
                <ActionButton button={exportButton} action={handleClick} />
            </div>
            <div style={{display: (!showExportButton  && !loading) ? 'block' : 'none'}}>
                <Modal  modal={thanksMessage}/>
            </div>
        </div> 
    </>);
};
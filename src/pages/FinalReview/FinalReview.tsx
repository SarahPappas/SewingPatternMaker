import React, { useEffect }    from 'react';
import { App } from 'canvas/AppController';
import { ActionButton } from 'components/ActionButton/ActionButton';

import './FinalReview.css';

export const FinalReview: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(false);

    // Generating the pdf takes time, so we are using an async call to not block the main js thread.
    // let handleExport: Promise<unknown>;
    let loader;
    if (loading) {
        console.log("loading is true");
        loader = <div className={'lds-hourglass'}/>;
    } else {
        console.log("loading is false");
        loader = <div />;
    }
    
    const handleClick = () => {
        setLoading(true);

        setTimeout(() => {
            App.exporter.save();
            setLoading(false);
        }, 0);
    };

    const exportButton: Button = {label: 'EXPORT PDF', className: 'navButton'};
    return (<>
        <div>
            Final review pages
        </div>
        <div id={'download-pattern'} />
        {loader}
        <ActionButton button={exportButton} action={handleClick} />
    </>);
};
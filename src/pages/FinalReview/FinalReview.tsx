import React, { useEffect } from "react";
import { App } from "canvas/AppController";
import { ActionButton } from "components/ActionButton/ActionButton";

export const FinalReview: React.FC = () => {
    useEffect(() => {
        App.renderer.finalReviewInit();
    }, []);
    
    const handleExport = (): void => {
        App.exporter.save();
    };

    const exportButton: Button = {label: 'EXPORT PDF', className: 'navButton'};
    return (<>
        <div>
            Final review pages
        </div>
        <ActionButton button={exportButton} action={handleExport} />
    </>);
};
import React, { useEffect } from "react";
import { App } from "canvas/AppController";

export const FinalReview: React.FC = () => {
    useEffect(() => {
        App.renderer.finalReviewInit();
    }, []);
    
    return (<>
        <div>
            Final review page
        </div>
    </>);
};
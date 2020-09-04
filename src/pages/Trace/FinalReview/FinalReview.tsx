import React, { useEffect } from "react";
import { App } from "canvas/AppController";

export const FinalReview: React.FC = () => {
    useEffect(() => {
        //App.renderer.finalReviewInit();

        // for inspection of paths on final review
        App.renderer.measurementInit();
    }, []);
    
    return (<>
        <div>
            Final review page
        </div>
    </>);
};
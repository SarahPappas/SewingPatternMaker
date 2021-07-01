import React, { useEffect } from 'react';

interface UseBackButtonProps {
    handler: (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const UseBackButton: React.FC<UseBackButtonProps> = ({handler}) => {
    useEffect(() => {
        let outsidePage = false;
        document.onmouseover = () => {
            //User's mouse is inside the page.
            outsidePage = false;
        };
        
        document.onmouseleave = () => {
            //User's mouse has left the page.
            outsidePage = true;
        };

        const handlePopState = (e: PopStateEvent) => {
            console.log("popstateev", e);

            if (outsidePage)
            {
                handler(e);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [handler]);
     
    return(<></>);
};
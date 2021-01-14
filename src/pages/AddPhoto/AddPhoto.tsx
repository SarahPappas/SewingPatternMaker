import React, { useEffect, useState } from 'react';
import './AddPhoto.css';
import { NavButton } from 'components/NavButton/NavButton';
import { UploadPhoto } from 'components/UploadPhoto/UploadPhoto';

const button: Button = { label: "START TRACING"};

interface AddPhotoProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
    uploadedFileData: string;
}

export const AddPhoto: React.FC<AddPhotoProps> = ({ setUploadedFileData, uploadedFileData }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Reset file data to empty string if user uses back button
    useEffect(() => {
        setUploadedFileData("");
    }, [setUploadedFileData]);

    useEffect(() => {
        setIsVisible(uploadedFileData !== "");
    }, [uploadedFileData]);
    
    return (<>
        <UploadPhoto setUploadedFileData={setUploadedFileData}></UploadPhoto>
        <div style={{visibility: isVisible ? 'visible' : 'hidden'}} className={'startTracingButton'}>
            <NavButton button={button} to="/trace/instructions"></NavButton>
        </div>
    </>);
};
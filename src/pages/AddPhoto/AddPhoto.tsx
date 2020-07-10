import React from 'react';
import './AddPhoto.css';
import { NavButton } from 'components/NavButton/NavButton';
import { UploadPhoto } from 'components/UploadPhoto/UploadPhoto';

const button: Button = { text: "START TRACING", to: "/trace/instructions" };

interface AddPhotoProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
    uploadedFileData: string;
}

export const AddPhoto: React.FC<AddPhotoProps> = ({ setUploadedFileData, uploadedFileData }) => {
    let displayButton = <></>;
    if (uploadedFileData !== "") {
        displayButton = <NavButton button={button}></NavButton>;
    }
    
    return (
        <div className='addPhotoContainer'>
            <UploadPhoto setUploadedFileData={setUploadedFileData}></UploadPhoto>
            {/* Use generic button here */}
            {displayButton}
        </div>
    );
};
import React from 'react';
import './AddPhoto.css';
import { NavButton } from 'components/NavButton/NavButton';
import { UploadPhoto } from 'components/UploadPhoto/UploadPhoto';

const button: NavButton = { text: "START TRACING", to: "/trace/instructions" };

interface AddPhotoProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
    uploadedFileData: string;
}

export const AddPhoto: React.FC<AddPhotoProps> = ({ setUploadedFileData, uploadedFileData }) => {
    const isVisible = uploadedFileData !== "";
    
    return (
        <>
            <UploadPhoto setUploadedFileData={setUploadedFileData}></UploadPhoto>
            <div style={{visibility: isVisible ? 'visible' : 'hidden'}}>
                <NavButton button={button}></NavButton>
            </div>
        </>
    );
};
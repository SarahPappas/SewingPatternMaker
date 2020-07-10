import React from 'react';
import './AddPhoto.css';
import { NavButton } from 'components/NavButton/NavButton';
import { UploadPhoto } from 'components/UploadPhoto/UploadPhoto';

const button: Button = {text: "START TRACING", to: "/trace/instructions" };

interface AddPhotoProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
}

export const AddPhoto: React.FC<AddPhotoProps> = ({setUploadedFileData}) => {
    return (
        <div className='addPhotoContainer'>
            <UploadPhoto setUploadedFileData={setUploadedFileData}></UploadPhoto>
            <NavButton button={button}/>
        </div>
    );
};
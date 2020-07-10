import React from 'react';
import './AddPhoto.css';
import { NavButton } from 'components/NavButton/NavButton';
import { UploadPhoto } from 'components/UploadPhoto/UploadPhoto';

const button: Button = {text: "UPLOAD PHOTO", to: "/trace/instructions" };

interface AddPhotoProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
}

export const AddPhoto: React.FC<AddPhotoProps> = ({setUploadedFileData}) => {
    return (
        <div className='addPhotoContainer'>
            <NavButton button={button}/>
            <UploadPhoto setUploadedFileData={setUploadedFileData}></UploadPhoto>
        </div>
    );
};
import React from 'react';
import './AddPhoto.css';
import { NavButton } from 'components/NavButton/NavButton';
import { UploadPhoto } from 'components/UploadPhoto/UploadPhoto';

const button: Button = {text: "UPLOAD PHOTO", to: "/trace/instructions" };

export const AddPhoto: React.FC = () => {
    return (
        <div className='addPhotoContainer'>
            <NavButton button={button}/>
            <UploadPhoto></UploadPhoto>
        </div>
    );
};
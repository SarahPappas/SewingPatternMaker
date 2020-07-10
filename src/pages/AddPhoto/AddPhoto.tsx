import React from 'react';
import './AddPhoto.css';
import { NavButton } from 'components/NavButton/NavButton';
import { UploadPhoto } from 'components/UploadPhoto/UploadPhoto';

const button: Button = {text: "UPLOAD PHOTO", to: "/trace/instructions" };

interface AddPhotoProps {
    canvasContainerRef: React.RefObject<HTMLDivElement>;
}

export const AddPhoto: React.FC<AddPhotoProps> = ({canvasContainerRef}) => {
    return (
        <div className='addPhotoContainer'>
            <NavButton button={button}/>
            <UploadPhoto canvasContainerRef={canvasContainerRef}></UploadPhoto>
        </div>
    );
};
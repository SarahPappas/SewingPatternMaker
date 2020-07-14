import React, { ChangeEvent } from 'react';
import { InputButton } from 'components/InputButton/InputButton';
import defaultPhoto from '../../assets/defaultPhoto.jpg';
import './UploadPhoto.css';
import '../NavButton/NavButton.css';

interface UploadPhotoProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
}

export const UploadPhoto: React.FC<UploadPhotoProps> = ({setUploadedFileData}) => {
    const uploadedImage = React.useRef(document.createElement("img"));

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList: FileList | null = e.target.files;

        if (fileList && fileList[0]) {
            const file = fileList[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setUploadedFileData(reader.result.toString());
                    uploadedImage.current.src = reader.result.toString();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const buttonProps: ActionButton = {label: 'UPLOAD PHOTO', action: handleImageUpload};
    const uploadImageInput = { id: 'photo-input', type: 'file', accept: 'image/*', className: 'navButton uploadButton'};
    
    return (
        <>
            <InputButton button={buttonProps} input={uploadImageInput}></InputButton>

            <label htmlFor='photo-input'>
                <img className='photo' alt='your garment' src={defaultPhoto} ref={uploadedImage}/>
            </label>            
        </>
    );
};
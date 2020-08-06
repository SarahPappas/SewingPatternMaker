import React, { ChangeEvent } from 'react';
import { Input } from 'components/Input/Input';
import defaultPhoto from '../../assets/upload-photo-icon.svg';
import './UploadPhoto.css';

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

    const uploadImageInput: Input = { 
        id: 'photo-input', 
        type: 'file', 
        accept: 'image/*',
        onChange: handleImageUpload
    };
    const inputButton: Button = {label: 'UPLOAD PHOTO', className: 'navButton uploadButton'};
    
    return (
        <>
            <Input input={uploadImageInput} button={inputButton}></Input>

            <label htmlFor='photo-input'>
                <img className='photo' alt='your garment' src={defaultPhoto} ref={uploadedImage}/>
            </label>            
        </>
    );
};
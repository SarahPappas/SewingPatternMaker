import React, { ChangeEvent } from 'react';
import defaultPhoto from '../../assets/defaultPhoto.jpg';
import './UploadPhoto.css';

interface UploadPhotoProps {
    setUploadedFileData: React.Dispatch<React.SetStateAction<string>>;
}

const UploadPhoto: React.FC<UploadPhotoProps> = ({setUploadedFileData}) => {
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
    
    return (
        <div className='uploadPhotoContainer'>
            <input id='photo-input' type='file' accept='image/*' onChange={handleImageUpload} multiple={false}/>

            {/* Use button component here */}
            <label htmlFor='photo-input' className='uploadButton'>
                <div className='label'>
                    UPLOAD PHOTO
                </div>
            </label>

            <label htmlFor='photo-input'>
                <div className='photoContainer'>
                    <img className='photo' alt='your garment' src={defaultPhoto} ref={uploadedImage}/>
                </div>
            </label>            
        </div>
    );
};

export { UploadPhoto };
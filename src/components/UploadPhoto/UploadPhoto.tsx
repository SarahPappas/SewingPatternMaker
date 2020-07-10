import React, { ChangeEvent } from 'react';
import defaultPhoto from '../../assets/defaultPhoto.jpg';
import './UploadPhoto.css';

interface UploadPhotoProps {
    canvasContainerRef: React.RefObject<HTMLDivElement>;
}
const UploadPhoto: React.FC<UploadPhotoProps> = ( {canvasContainerRef} ) => {
    const uploadedImage = React.useRef(document.createElement("img"));

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList: FileList | null = e.target.files;

        if (fileList && fileList[0]) {
            const file = fileList[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    uploadedImage.current.src = reader.result.toString();
                    console.log("out");
                    if(canvasContainerRef.current) {
                        console.log("in");
                        canvasContainerRef.current.style.backgroundImage = 'url(' + reader.result.toString() + ')';
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className='uploadPhotoContainer'>
            <label htmlFor='photo-input'>
                <div className='photoContainer'>
                    <img className='photo' alt='your garment' src={defaultPhoto} ref={uploadedImage}/>
                </div>
            </label>
            
            <input id='photo-input' type='file' accept='image/*' onChange={handleImageUpload} multiple={false}/>
        </div>
    );
};

export { UploadPhoto };
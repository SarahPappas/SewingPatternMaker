import React, { ChangeEvent } from 'react';
import './AddPhoto.css';

export const AddPhoto: React.FC = () => {
    const uploadedImage = React.useRef(document.createElement("img"));

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList: FileList | null = e.target.files;
        if (fileList) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    uploadedImage.current.src = reader.result.toString();
                }
            };
            reader.readAsDataURL(fileList[0]);
        }
    };
    
    return (
        <div className='addPhoto'>
            <h2>Add Photo page</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} multiple={false}/>
            <div className='photoContainer'>
                <img className='photo' alt="your garment" ref={uploadedImage}/>
            </div>
        </div>
    );
};
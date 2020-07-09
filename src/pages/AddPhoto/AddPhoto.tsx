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
            <div style={{height: "200px",
                        width: "200px",
                        border: "2px dashed black"}}>
                <img alt="your garment" style={{width: "100%",
                                        position: "absolute"}} ref={uploadedImage}/>
            </div>
        </div>
    );
};
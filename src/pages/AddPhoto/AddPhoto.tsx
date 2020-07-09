import React from 'react';
import './AddPhoto.css';
import { UploadPhoto } from 'components/UploadPhoto/UploadPhoto';

export const AddPhoto: React.FC = () => {
    return (
        <div className='addPhoto'>
            <h2>Add Photo page</h2>
            <UploadPhoto></UploadPhoto>
        </div>
    );
};
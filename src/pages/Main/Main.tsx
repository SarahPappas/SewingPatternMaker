import React from 'react';
import './Main.css';
import { Route } from 'react-router-dom';
import { GetStarted } from 'pages/GetStarted/GetStarted';
import { AddPhoto } from 'pages/AddPhoto/AddPhoto';
import { Instructions } from 'pages/Trace/Instructions/Instructions';
import { CanvasContainer } from '../../components/CanvasContainer/CanvasContainer';
import { AddPath } from 'pages/Trace/AddPath/AddPath';

export const Main: React.FC = () => {
    const [uploadedFileData, setUploadedFileData] = React.useState<string>("");

    return <div className='pageContainer'><div className='mainContainer'>
        {/* Add route here to make component visible*/}
        <Route
            path="/trace/:slug"
            render={({match}) => {
                return <CanvasContainer uploadedFileData={uploadedFileData}></CanvasContainer>;
            }}
        />
        <Route exact path="/" component={GetStarted} />
        <Route 
            exact path="/AddPhoto" 
            render={() => {
                return <AddPhoto uploadedFileData={uploadedFileData} setUploadedFileData={setUploadedFileData}></AddPhoto>;
            }}
        />
        <Route exact path="/Trace/Instructions" component={Instructions} />
        <Route exact path="/Trace/AddPath" component={AddPath} />
    </div></div>;
};

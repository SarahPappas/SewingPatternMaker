import React from 'react';
import './Main.css';
import { Route } from 'react-router-dom';
import { GetStarted } from 'pages/GetStarted/GetStarted';
import { AddPhoto } from 'pages/AddPhoto/AddPhoto';
import { Instructions } from 'pages/Trace/Instructions/Instructions';
import { CanvasContainer } from '../../components/CanvasContainer/CanvasContainer';
import { AddPath } from 'pages/Trace/AddPath/AddPath';
import { PatternPathType } from 'canvas/Enums';
import { Review } from 'pages/Trace/Review/Review';
import { AddMeasurement } from 'pages/Trace/AddMeasurement/AddMeasurement';
import { FinalReview } from 'pages/Trace/FinalReview/FinalReview';

export const Main: React.FC = () => {
    const [uploadedFileData, setUploadedFileData] = React.useState<string>("");
    const [curPathType, setPathType] = React.useState<PatternPathType>(PatternPathType.UNDEFINED);

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
        <Route 
            exact path="/Trace/Instructions" 
            render={() => {
                return <Instructions curPathType={curPathType} setPathType={setPathType}/>;
            }}
        />
        <Route 
            exact path="/Trace/AddPath" 
            render={() => {
                return <AddPath curPathType={curPathType} setPathType={setPathType}/>;
            }}
        />
        <Route exact path="/Trace/Review" component={Review} />
        <Route 
            exact path="/Trace/AddMeasurement" 
            render= {() => {
                return <AddMeasurement setUploadedFileData={setUploadedFileData}/>;
            }}
        />
        <Route exact path="/Trace/FinalReview" component={FinalReview} />
    </div></div>;
};

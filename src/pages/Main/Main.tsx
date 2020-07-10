import React from 'react';
import './Main.css';
import { Route } from 'react-router-dom';
import { GetStarted } from 'pages/GetStarted/GetStarted';
import { AddPhoto } from 'pages/AddPhoto/AddPhoto';
import { Instructions } from 'pages/Trace/Instructions/Instructions';
import { CanvasContainer } from '../../components/CanvasContainer/CanvasContainer';

export const Main: React.FC = () => {
    const canvasContainerRef = React.useRef(document.createElement("div"));

    return <div className='pageContainer'><div className='mainContainer'>

        {/* Add route here to make component visible*/}
        <Route
            path="/AddPhoto"
            render={({match}) => {
                return <CanvasContainer canvasContainerRef={canvasContainerRef}></CanvasContainer>;
            }}
        />
        <Route exact path="/" component={GetStarted} />
        <Route exact path="/AddPhoto" render={() => {return <AddPhoto canvasContainerRef={canvasContainerRef}></AddPhoto>;}} />
        <Route exact path="/Trace/Instructions" component={Instructions} />
    </div></div>;
};

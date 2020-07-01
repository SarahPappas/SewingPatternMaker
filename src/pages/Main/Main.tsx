import React from 'react';
import './Main.css';
import { Route } from 'react-router-dom';
import { GetStarted } from 'pages/GetStarted/GetStarted';
import { AddPhoto } from 'pages/AddPhoto/AddPhoto';
import { Instructions } from 'pages/Trace/Instructions/Instructions';
import { CanvasContainer } from '../../components/CanvasContainer/CanvasContainer';

export const Main: React.FC = () => {
    return <div className='pageContainer'><div className='mainContainer'>

        {/* Add route here to make component visible*/}
        <Route
            path="/trace/:slug"
            render={({match}) => {
                return <CanvasContainer></CanvasContainer>
            }}
        />
        <Route exact path="/" component={GetStarted} />
        <Route exact path="/AddPhoto" component={AddPhoto} />
        <Route exact path="/Trace/Instructions" component={Instructions} />
    </div></div>
};

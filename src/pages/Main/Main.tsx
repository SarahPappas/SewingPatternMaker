import React from 'react';
import './Main.css';
import { Route } from 'react-router-dom';
import { GetStarted } from 'pages/GetStarted/GetStarted';
import { AddPhoto } from 'pages/AddPhoto/AddPhoto';
import { CanvasContainer } from '../../components/CanvasContainer/CanvasContainer';

export const Main: React.FC = () => {
    function renderCanvas() {
        return <CanvasContainer ></CanvasContainer>
    }

    return <div className='mainContainer'>
        {/* Add route here to make component visible*/}
        <React.Fragment>
            {renderCanvas()}
        </React.Fragment>
        <Route exact path="/" component={GetStarted} />
        <Route exact path="/AddPhoto" component={AddPhoto} />
    </div>
}
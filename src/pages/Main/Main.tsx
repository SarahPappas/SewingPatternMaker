import React from 'react';
import './Main.css';
import { Route } from 'react-router-dom';
import { GetStarted } from 'pages/GetStarted/GetStarted';
import { AddPhoto } from 'pages/AddPhoto/AddPhoto';

export const Main: React.FC= () => {
    return <div className='mainContainer'>
        {/* Add route here to make component visible*/}
        <Route exact path="/" component={GetStarted} />
        <Route exact path="/AddPhoto" component={AddPhoto} />
    </div>
}
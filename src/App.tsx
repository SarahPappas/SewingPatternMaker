import React from 'react';
import { Main } from 'pages/Main/Main';
import { HashRouter as Router } from "react-router-dom";

function App() {
  // For responsive CSS layout
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  return (
    <>
      <Router>
        <Main />
      </Router>
    </>
  );
}

export default App;

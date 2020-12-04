import React from 'react';
import { Main } from 'pages/Main/Main';
import { HashRouter as Router } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Main />
      </Router>
    </>
  );
}

export default App;

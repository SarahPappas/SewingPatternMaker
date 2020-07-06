import React from 'react';
import { Main } from 'pages/Main/Main';
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Main />
      </Router>
      <link href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap" rel="stylesheet" />
    </>
  );
}

export default App;

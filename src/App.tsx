import React from 'react';
import { NavButton } from './components/NavButton/NavButton';

const button: Button = {text: "Get Started", to: ""};

function App() {
  return (
   <NavButton button={button}/>
  );
}

export default App;

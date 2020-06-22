import React from 'react';
import { NavButton } from './components/NavButton/NavButton';

const button: Button = {text: "Get Started"};

function App() {
  return (
   <NavButton button={button}/>
  );
}

export default App;

import React from 'react';
import { NavButton } from './NavButton';
import { CanvasDiv } from './CanvasDiv';

const button: Button = {text: " canvas"};

function App() {
  const [wrapped, setWrapped] = React.useState<Boolean>(false);  

  function renderCanvas() {
    return <CanvasDiv ></CanvasDiv>
  }

  function renderWrappedCanvas() {
    if (wrapped) {
    return <div style={{border: "solid"}}>{renderCanvas()}</div>
    } else {
      return renderCanvas()
    }
  }

  return (
    <React.Fragment>
      {renderWrappedCanvas()}
      <NavButton button={button} wrapped={wrapped} setWrap={setWrapped}/>
    </React.Fragment>
    
  );
}

export default App;

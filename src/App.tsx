import React from 'react';
import { NavButton } from './NavButton';
import { Canvas } from './Canvas';
import { LoadButton } from './LoadButton';

const button: Button = {text: " canvas"};

function App() {
  const [wrapped, setWrapped] = React.useState<Boolean>(false);  

  // const draw = (context: CanvasRenderingContext2D, location: Point) => {
  //   context.fillStyle = '#000000'
  //   context.save()
  //   context.scale(0.3, 0.3)
  //   context.translate(location.x / 0.3, location.y / 0.3 - 20)
  //   context.fill(HOOK_PATH)
  //   context.restore()
  // }

  function renderCanvas() {
    return <Canvas ></Canvas>
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
      <LoadButton></LoadButton>
      <NavButton button={button} wrapped={wrapped} setWrap={setWrapped}/>
    </React.Fragment>
    
  );
}

export default App;

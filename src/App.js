import logo from './logo.svg';
import './App.css';
import Navigation from './Navigation';
import Recorder from './recorder';


function App() {
  return (
    <div className='App'>
      <Navigation></Navigation>
    
      <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", marginLeft:"10vh"}}>
        <Recorder></Recorder>

      </div>
    </div>
  );
}

export default App;

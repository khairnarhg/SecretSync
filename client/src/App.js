import {BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './Routes'
import './App.css';

function App() {
  return (
    <div className="App">
      <AppRoutes/>
    <Router />
    </div>
  );
}

export default App;

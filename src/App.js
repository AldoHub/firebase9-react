import './App.css';
import AppRoutes from "./routes/routes";
import { NavLink, useHistory } from "react-router-dom";

function App() {
  return (
    <div className="App">
    
      <nav>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/new">create new</NavLink></li>
        </ul>
      </nav>
      <AppRoutes/>
    </div>
  );
}

export default App;

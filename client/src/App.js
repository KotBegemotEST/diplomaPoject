import {BrowserRouter,Routes,Route} from "react-router-dom"
import Dashboard from "./pages/Dashboard";
import HourlyRates from "./pages/HourlyRates";
import ExtraRates from "./pages/ExtraRates";
import Salary from "./pages/Salary";
import Login from "./pages/Login";
import Main from "./pages/Main";

function App() {
  
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard" element={<HourlyRates/>}/>
          <Route path="/hourlyRates" element={<HourlyRates/>}/>
          <Route path="/extraRates" element={<ExtraRates/>}/>
          <Route path="/salarySend" element={<Salary/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

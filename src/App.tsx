import './App.scss'
import {Outlet} from "react-router-dom";

function App() {

  return (
    <div className="h-screen w-screen overflow-hidden">
     <Outlet></Outlet>
    </div>
  )
}

export default App

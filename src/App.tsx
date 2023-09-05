import './App.scss'
import {Outlet} from "react-router-dom";
import {useEffect} from "react";
import {updateUserOnlineStatus} from "./API/firebase/database.ts";

function App() {
    useEffect(()=>{
        window.addEventListener("beforeunload", () => updateUserOnlineStatus(Date.now()));
    },[])

  return (
    <div className="h-screen w-screen overflow-hidden">
     <Outlet></Outlet>
    </div>
  )
}

export default App

import Login from "../components/pages/login/login.tsx";
import Home from "../components/pages/home/home.tsx";
import App from "../App.tsx";
import {Navigate, redirect, RouteObject} from "react-router-dom";

const routes: RouteObject[] = [
    {
        path: '',
        element: <App/>,
        children: [
            {
                path: '',
                element: <Navigate to={'login'} replace={true}/>
            }, {
                path: 'login',
                element: <Login/>,
            }, {
                path: 'home',
                element: <Home/>,
            }
        ]
    }
]

export default routes;


function findUser() {
    let user = true;
    if (!user) {
        return redirect('/login')
    }
    return null;
}



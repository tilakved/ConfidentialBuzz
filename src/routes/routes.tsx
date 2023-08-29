import Login from "../components/pages/login/login.tsx";
import App from "../App.tsx";
import {Navigate, redirect, RouteObject} from "react-router-dom";

const routes:RouteObject[] = [
    {
        path: '',
        element: <App/>,
        children: [
            {
                path: '',
                loader: findUser(),
                element: <Navigate to={'login'} replace={true}/>
            }, {
                path: 'login',
                loader: findUser(),
                element: <Login/>,
        }
        ]
    }
]

export default routes;


function findUser(){
    let user = true;
    if(!user){
        return redirect('/login')
    }
    return null;
}



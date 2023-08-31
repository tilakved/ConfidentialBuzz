import Login from "../components/pages/login/login.tsx";
import Home from "../components/pages/home/home.tsx";
import App from "../App.tsx";
import {Navigate, redirect, RouteObject} from "react-router-dom";
import {auth} from "../API/firebase.config.ts";

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
                loader: authGuard
            }, {
                path: 'home',
                element: <Home/>,
                loader: authGuard
            }
        ]
    }
]

export default routes;


async function authGuard({request: {url}}: {request: { url: string }}) {
    const forLogin: boolean = url.split("/").pop() === "login";
    await auth.authStateReady();
    const isLoggedIn = !!auth.currentUser;

    if (isLoggedIn) {
        if (!forLogin) return true;
        return redirect("/home");
    }
    if (forLogin) return true;
    return redirect("/login");
}



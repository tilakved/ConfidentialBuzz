import ReactDOM from 'react-dom/client'
import './index.scss'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import routes from "./routes/routes.tsx";

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)

import './home.scss'
import {auth} from '../../../API/firebase.config.ts';
import {useNavigate} from "react-router-dom";
import Logo from '../../../../public/vite.svg';
import {BiLogOut, BiUserCircle} from "react-icons/bi";
import {MdOutlineGroups2} from "react-icons/md";
import {FaGear} from "react-icons/fa6";
import {ReactElement, useEffect, useState} from "react";
import Accounts from "../accounts/accounts.tsx";
import Profile from "../profile/profile.tsx";
import Settings from "../settings/settings.tsx";
import {updateUserOnlineStatus} from "../../../API/firebase/database.ts";

interface ElementHolder {
    accounts: ReactElement;
    profile: ReactElement;
    settings: ReactElement;
}

function Home() {
    const navigate = useNavigate();
    const [viewContent, setViewContent] = useState<keyof ElementHolder>('accounts')
    const modes: ElementHolder = {
        accounts: <Accounts/>,
        profile: <Profile/>,
        settings: <Settings/>
    }
    useEffect(() => {
        const mode = localStorage.getItem('mode');
        if (!mode) {
            localStorage.setItem('mode', 'dark')
            return;
        }else{
            const html = document.getElementsByTagName("html")
            html[0].className = mode;
        }

    }, []);

    useEffect(() => {
        updateUserOnlineStatus('active').catch((err) => console.error(err))
    }, [])

    function LogOut() {
        const respond = confirm("Are you sure you want to logout?")
        if (respond) {
            updateUserOnlineStatus(Date.now()).catch((err) => {
                console.error(err)
            })
            auth.signOut();
            navigate('/login')
        }
    }

    function handleOnView(value: keyof ElementHolder) {
        setViewContent(value)
    }

    return (
        <div className="overflow-y-hidden">
            <div className="flex">
                <div
                    className="bg-white dark:bg-gray-900 flex flex-col h-screen border-r dark:border-gray-700 fixed">
                    <div
                        className="flex flex-col items-center h-screen pt-8 bg-white space-y-8 dark:bg-gray-900 dark:border-gray-700">
                        <a>
                            <img className="w-[1.7rem]" src={Logo} alt=""/>
                        </a>
                        {/*text-blue-500*/}
                        <a className={`p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 cursor-pointer ${viewContent == 'profile' && 'dark:bg-gray-800 bg-gray-200'}`}
                           onClick={() => handleOnView("profile")}>
                            <BiUserCircle size={'1.7rem'}/>
                        </a>
                        <a className={`p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 cursor-pointer ${viewContent == 'accounts' && 'dark:bg-gray-800 bg-gray-200'}`}
                           onClick={() => handleOnView('accounts')}>
                            <MdOutlineGroups2 size={'1.7rem'}/>
                        </a>

                        <a className={`p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100   cursor-pointer ${viewContent == 'settings' && 'dark:bg-gray-800 bg-gray-200'}`}
                           onClick={() => handleOnView('settings')}>
                            <FaGear size={'1.7rem'}/>
                        </a>
                    </div>
                    <hr className="w-full"/>
                    <div className="p-4">
                        <a className="flex p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                           onClick={() => LogOut()}>
                            <BiLogOut size={'1.7rem'}/>
                        </a>
                    </div>
                </div>
                <div className="overflow-y-auto w-full ml-[72px]">
                    {viewContent in modes && modes[viewContent]}
                </div>
            </div>
        </div>
    )
}

export default Home;

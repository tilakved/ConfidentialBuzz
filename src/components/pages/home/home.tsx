import './home.scss'
import {auth} from '../../../API/firebase.config.ts';
import {useNavigate} from "react-router-dom";
import Logo from '../../../../public/vite.svg';
import {BiLogOut, BiUserCircle} from "react-icons/bi";
import {MdOutlineGroups2} from "react-icons/md";
import {FaGear} from "react-icons/fa6";
import {useState} from "react";

function Home() {
    const navigate = useNavigate();
    // "accounts"|"profile"|"settings"
    const [viewContent, setViewContent] = useState('accounts')

    function LogOut() {
        auth.signOut();
        navigate('/login')
    }

    function handleOnView(value: string) {
        setViewContent(value)
    }

    return (
        <>
            <aside className="flex">
                <div
                    className="bg-white dark:bg-gray-900 flex flex-col h-screen border-r dark:border-gray-700">
                    <div
                        className="flex flex-col items-center h-screen pt-8 bg-white space-y-8 dark:bg-gray-900 dark:border-gray-700">
                        <a>
                            <img className="w-auto h-6" src={Logo} alt=""/>
                        </a>

                        <a className={viewContent == 'profile' ? 'p-1.5 text-blue-500 transition-colors duration-200 bg-blue-100 rounded-lg dark:text-blue-400 dark:bg-gray-800 cursor-pointer' : 'p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 cursor-pointer'}
                           onClick={() => handleOnView('profile')}>
                            <BiUserCircle size={'1.5rem'}/>
                        </a>
                        <a className={viewContent == 'accounts' ? 'p-1.5 text-blue-500 transition-colors duration-200 bg-blue-100 rounded-lg dark:text-blue-400 dark:bg-gray-800 cursor-pointer' : 'p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 cursor-pointer'}
                           onClick={() => handleOnView('accounts')}>
                            <MdOutlineGroups2 size={'1.5rem'}/>
                        </a>

                        <a className={viewContent == 'settings' ? 'p-1.5 text-blue-500 transition-colors duration-200 bg-blue-100 rounded-lg dark:text-blue-400 dark:bg-gray-800 cursor-pointer' : 'p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 cursor-pointer'}
                           onClick={() => handleOnView('settings')}>
                            <FaGear size={'1.5rem'}/>
                        </a>
                    </div>
                    <hr className="w-full"/>
                    <div className="p-4">
                        <a className="flex p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                           onClick={() => LogOut()}>
                            <BiLogOut size={'1.5rem'}/>
                        </a>
                    </div>
                </div>
                {viewContent == 'accounts' &&
                    <div className="h-screen overflow-y-auto bg-white border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700">
                        <div>
                            <h2 className="p-5 text-lg font-medium text-gray-800 dark:text-white">Accounts</h2>
                            <hr/>
                            <div className="mt-2 space-y-1">

                                <button
                                    className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                                    <img className="object-cover w-8 h-8 rounded-full"
                                         src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                                         alt=""/>

                                    <div className="text-left rtl:text-right">
                                        <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Mia
                                            John</h1>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">11.2 Followers</p>
                                    </div>
                                </button>

                                <button
                                    className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                                    <img className="object-cover w-8 h-8 rounded-full"
                                         src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&h=880&q=80"
                                         alt=""/>

                                    <div className="text-left rtl:text-right">
                                        <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">arthur
                                            melo</h1>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">1.2 Followers</p>
                                    </div>
                                </button>

                                <button
                                    className="flex items-center w-full px-5 py-2 transition-colors duration-200 bg-gray-100 dark:bg-gray-800 gap-x-2 focus:outline-none">
                                    <div className="relative">
                                        <img className="object-cover w-8 h-8 rounded-full"
                                             src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&h=764&q=100"
                                             alt=""/>
                                        <span
                                            className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>
                                    </div>

                                    <div className="text-left rtl:text-right">
                                        <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Jane
                                            Doe</h1>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">15.6 Followers</p>
                                    </div>
                                </button>

                                <button
                                    className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                                    <img className="object-cover w-8 h-8 rounded-full"
                                         src="https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&h=764&q=80"
                                         alt=""/>

                                    <div className="text-left rtl:text-right">
                                        <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Amelia.
                                            Anderson</h1>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">32.9 Followers</p>
                                    </div>
                                </button>

                                <button
                                    className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                                    <img className="object-cover w-8 h-8 rounded-full"
                                         src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&h=687&q=80"
                                         alt=""/>

                                    <div className="text-left rtl:text-right">
                                        <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Joseph
                                            Gonzalez</h1>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">100.2 Followers</p>
                                    </div>
                                </button>

                                <button
                                    className="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 gap-x-2 focus:outline-none">
                                    <div className="relative">
                                        <img className="object-cover w-8 h-8 rounded-full"
                                             src="https://images.unsplash.com/photo-1488508872907-592763824245?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&h=1470&q=80"
                                             alt=""/>
                                        <span
                                            className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>
                                    </div>

                                    <div className="text-left rtl:text-right">
                                        <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Olivia
                                            Wathan</h1>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">8.6 Followers</p>
                                    </div>
                                </button>

                                <button
                                    className="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 gap-x-2 focus:outline-none">
                                    <div className="relative">
                                        <img className="object-cover w-8 h-8 rounded-full"
                                             src="https://images.unsplash.com/photo-1608174386344-80898cec6beb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&h=687&q=80"
                                             alt=""/>
                                        <span
                                            className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>
                                    </div>

                                    <div className="text-left rtl:text-right">
                                        <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Junior
                                            REIS</h1>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">56.6 Followers</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </aside>
        </>
    )
}

export default Home;

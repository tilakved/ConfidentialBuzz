import "./settings.scss"
import {useEffect, useState} from "react";
import {PiMoon, PiSunLight} from "react-icons/pi";

interface State {
    mode: string | null;
}

function Settings() {
    // State
    const [state, setState] = useState<State>(
        {mode: null}
    )
    // /State


    // Effects
    useEffect(() => {
        const localMode = localStorage.getItem('mode')
        updateState({mode: localMode})
    }, []);


    useEffect(() => {
        if (!state.mode) return;
        localStorage.setItem('mode', state.mode);
        const html = document.getElementsByTagName("html")
        html[0].className = state.mode;
    }, [state.mode]);

    // /Effects

    // function
    function updateState(updates: Partial<State>) {
        setState(prev => ({...prev, ...updates}))
    }

    function updateMode() {
        updateState({mode: (state.mode === 'dark' ? 'light' : 'dark')})
    }

    // /function
    return (
        <div className="flex w-full">
            {/*left-sidebar*/}
            <div
                className="h-screen overflow-y-auto bg-white border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700">
                <div>
                    <h2 className="p-5 text-lg font-medium text-gray-800 dark:text-white">Settings</h2>
                    <hr/>
                    <div className="mt-2 space-y-1">

                        <button
                            className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:bg-gray-800 gap-x-2 bg-gray-100 focus:outline-none">
                            <div className="text-left rtl:text-right">
                                <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Theme
                                    selection</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Set your theme wisely.</p>
                            </div>
                        </button>

                    </div>
                </div>
            </div>
            {/*right-sidebar    */}
            <div className="p-5 flex flex-wrap w-1/2">
                <div className="bg-white m-3 flex h-64 dark:bg-gray-600 card overflow-auto">
                    <div
                        className={"w-1/3 flex justify-center items-center p-10 border-r-4 border-gray-700 bg-primary/70"}>
                        {state.mode == 'light' &&
                            < PiSunLight size={"2rem"}/>
                        }
                        {state.mode == 'dark' &&
                            <PiMoon size={"2rem"}/>
                        }
                    </div>
                    <div className={"flex flex-col p-10 break-words w-2/3"}>
                        <p className={"block text-2xl p-2"}>Update Mode here !!</p>
                        <p className={"block text-l p-2 w-full"}>You can update your mode. Your current mode
                            is {state.mode}.</p>
                        <span className={"flex items-end flex-col"}>
                        <button className={"bg-primary px-2 py-1 rounded-xl text-l w-fit"}
                                onClick={() => updateMode()}>Change Mode
                        </button>
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}


export default Settings

import "./settings.scss"
import {useEffect, useState} from "react";

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
        if(!state.mode){
            // updateState({mode: 'dark'})
            return
        }
        // localStorage.setItem('mode', state.mode);
        const html = document.getElementsByTagName("html")
        html[0].className = state.mode;
    }, [state]);

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
                                <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Theme selection</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Set your theme wisely.</p>
                            </div>
                        </button>

                    </div>
                </div>
            </div>
            {/*right-sidebar    */}
            <div className="p-5">
                <button onClick={() => updateMode()}>update mode
                </button>
            </div>
        </div>
    )
}


export default Settings

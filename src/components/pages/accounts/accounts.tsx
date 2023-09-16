import "./accounts.scss"
import {useEffect, useMemo, useState} from "react";
import {
    ConversationUser,
    createConversation, createMessage,
    getConversationListContinuous, getMessageLists,
    getSearchList, Message,
} from "../../../API/firebase/database.ts";
import {BsInfoCircle, BsSearch} from "react-icons/bs";
import {BiRightArrowCircle} from "react-icons/bi";
import {ImAttachment, ImCross} from "react-icons/im";
import {IoMdSend} from "react-icons/io";
import {failAlert} from "../../../swal/swal.ts";

interface State {
    searchString: string;
    showModal: boolean;
    conversationList: any[],
    selectedConversationId: string | null;
    userSearchResults: any[];
    messageValue: string;
    messageList: Message[];
}

function Accounts() {

    // State

    const [state, setState] = useState<State>({
        searchString: '',
        showModal: false,
        conversationList: [],
        selectedConversationId: null,
        userSearchResults: [],
        messageValue: '',
        messageList: []
    })

    function updateState(updates: Partial<State>) {
        setState(prev => ({...prev, ...updates}))
    }

    // /State


    // Effects
    useEffect(() => {
        getConversationListContinuous((res: any[]) => {
            updateState({conversationList: res})
        })
    }, []);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            await getSearchList(state.searchString, ((res:any) => {
                updateState({userSearchResults: res ?? []})
            }));
        }, 500);
        return () => {
            clearTimeout(timeout);
        }
    }, [state.searchString]);

    useEffect(() => {
        if (!state.selectedConversationId) return;
        updateState({messageList: []})
        getMessageLists(state.selectedConversationId, (res: Message[]) => {
            updateState({messageList: res})
        }).catch((err) => {
            console.error(err);
            failAlert('Error Occurred', err, 5000)
        })
    }, [state.selectedConversationId])

    useEffect(() => {
        const ele = document.querySelector('.messList');
        if (!ele) return;
        ele.scrollTop = ele?.scrollHeight
    }, [state.messageList]);

    // /Effects

    //Memo

    const selectedUser = useMemo(() => {
        if (!state.selectedConversationId) return null;
        const selectedUser = state.conversationList.find((i: ConversationUser) => i.conversationId === state.selectedConversationId);
        if (!selectedUser) {
            failAlert('Error Occurred', "Select again user not found!", 5000)
        }
        return selectedUser;
    }, [state.selectedConversationId, state.conversationList])


    // /Memo

    // Functions

    function selectConversation(conversationId: string) {
        updateState({selectedConversationId: conversationId});
    }

    function createConv(receiverId: string) {
        const existingConversationUser = state.conversationList.find(user => user.uid === receiverId);
        if (existingConversationUser) {
            selectConversation(existingConversationUser.conversationId);
            updateState({showModal: false});
            return;
        }
        createConversation(receiverId).then((conversationId) => {
            if (!conversationId) return;
            selectConversation(conversationId);
            updateState({showModal: false});
        }).catch((err) => {
            console.error("Error Occurred:", err)
            failAlert('Error Occurred', err, 5000)
        })
    }

    function sendMessage() {
        if (!state.selectedConversationId || !state.messageValue.trim()) return;
        createMessage(state.selectedConversationId, state.messageValue).catch((err) => {
            console.error("Error Occurred:", err)
            failAlert('Error Occurred', err, 5000)
        })
        updateState({messageValue: ''});
    }

    function isDateChanged(date1: number, date2: number): boolean {
        const d1 = new Date(date1).toDateString()
        const d2 = new Date(date2).toDateString()
        return d1 !== d2;
    }

    // /Functions


    return (
        <div className="flex w-full">
            {/*left-sidebar*/}
            <div
                className="h-screen  overflow-y-auto bg-white border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h2 className="p-5 text-lg font-medium text-gray-800 dark:text-white">Accounts</h2>
                    <span className="p-3 mr-3 rounded-xl cursor-pointer dark:hover:bg-gray-700"
                          onClick={() => updateState({showModal: true})}>
                            <BsSearch/>
                        </span>
                </div>
                <hr/>
                <div className="mt-2 space-y-1 convoList">
                    {state.conversationList.map((convo: ConversationUser, index: number) => {
                        return (
                            <button onClick={() => selectConversation(convo.conversationId as string)}
                                    key={index}
                                    className={`flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none ${state.selectedConversationId && state.selectedConversationId === convo.conversationId ? `bg-gray-100 dark:bg-gray-800` : ''}`}>
                                <div className="relative">
                                    <img className="object-cover w-8 h-8 rounded-full"

                                         src={convo.photoURL}
                                         alt=""/>
                                    {convo?.lastOnline === 'active' &&
                                        <span
                                            className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>
                                    }
                                </div>
                                <div className="text-left rtl:text-right">
                                    <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">{convo.displayName}</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{convo.lastMessage}</p>
                                </div>
                            </button>
                        )
                    })
                    }
                </div>
            </div>
            {/*    /!*right-sidebar    *!/*/}
            <div className="flex-1 flex flex-col">
                {selectedUser &&
                    <>
                        {/* top bar */}
                        <div className="w-full flex items-center justify-between p-2 border-b dark:border-gray-700">
                            <div
                                className="flex items-center w-full px-5 py-2 transition-colors duration-200 gap-x-2 focus:outline-none">
                                <div className="relative">
                                    <img className="object-cover w-8 h-8 rounded-full"
                                         src={selectedUser?.photoURL}
                                         alt=""/>
                                    {selectedUser?.lastOnline === 'active' &&
                                        <span
                                            className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>
                                    }
                                </div>
                                <div className="text-left rtl:text-right">
                                    <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">{selectedUser?.displayName}</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedUser?.lastOnline !== 'active' ? new Date(selectedUser?.lastOnline).toLocaleString("en-IN", {
                                        dateStyle: 'short',
                                        timeStyle: 'short'
                                    }) : 'active'} </p>
                                </div>
                            </div>
                            <div className="mr-4 p-2 rounded-xl cursor-pointer dark:hover:bg-gray-700">
                                <BsInfoCircle size={'1.2rem'}/>
                            </div>
                        </div>
                        <div className="h-full messList scroll-smooth">
                            <div className="messages">
                                {state.messageList.map((mes: Message, index: number, messages) => {
                                    return (<div key={index}>
                                            {!!!index &&
                                                <div className="flex w-full items-center gap-2 my-3" >
                                                    <hr className="border-b dark:border-gray-700 w-full"/>
                                                    <span
                                                        className="w-full text-center">{new Date(mes.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : new Date(mes.createdAt).toDateString()}</span>
                                                    <hr className="w-full border-b dark:border-gray-700"/>
                                                </div>
                                            }
                                            {!!index && isDateChanged(messages[index - 1].createdAt, messages[index].createdAt) &&
                                                <div className="flex w-full items-center gap-2 my-3" >
                                                    <hr className="border-b dark:border-gray-700 w-full"/>
                                                    <span
                                                        className="w-full text-center">{new Date(mes.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : new Date(mes.createdAt).toDateString()}</span>
                                                    <hr className="w-full border-b dark:border-gray-700"/>
                                                </div>}
                                            <div
                                                 className={`flex ${mes.senderId === selectedUser.uid ? 'justify-start' : 'justify-end'}`}>
                                                <div
                                                    className={`m-3 lg:w-1/2 md:w-full max-w-[50vw] p-2 rounded-xl flex flex-col justify-end ${mes.senderId === selectedUser.uid ? 'bg-primary/50' : 'bg-primary'}`}>
                                                    <span className="p-2 break-words overflow-auto">{mes.messageContent}</span>
                                                    {mes.senderId === selectedUser.uid && <span
                                                        className="text-[11px] text-left">{new Date(mes.createdAt).toLocaleString("en-IN", {timeStyle: 'short'})}</span>}
                                                    {mes.senderId !== selectedUser.uid && <span
                                                        className="text-[11px] text-right">{new Date(mes.createdAt).toLocaleString("en-IN", {timeStyle: 'short'})}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                        {/*bottom bar*/}
                        <div className="p-4 border-t border-gray-700">
                            <div className="w-full flex gap-2">
                                <button className="dark:bg-gray-800 p-2 rounded text-white"><ImAttachment
                                    size={'1.7rem'}/></button>
                                <input placeholder="Write message here..." value={state.messageValue}
                                       name="messageInput" id="messageInput"
                                       onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                       onChange={(event) => updateState({messageValue: (event.target.value) ?? ""})}
                                       className="p-2 rounded text-white w-full outline-none dark:bg-gray-800"/>
                                <button className="dark:bg-gray-800 p-2 rounded text-white"
                                        onClick={() => sendMessage()}><IoMdSend size={'1.7rem'}/>
                                </button>
                            </div>
                        </div>
                    </>
                }
                {!state.selectedConversationId &&
                    <div
                        className="w-full flex items-center justify-between p-2 border-b dark:border-gray-700 h-full noDataFound"></div>
                }
            </div>
            {/*search popup*/}
            <>
                {state.showModal &&
                    <div className="modal overlay h-screen w-screen">
                        <div
                            className="modal container flex justify-center items-center px-15 py-10  dark:bg-gray-800 w-full">
                            <div
                                className="dark:bg-gray-800 px-15 py-1 flex flex-col justify-center items-center w-1/2">
                                <h1 className="text-3xl font-semibold leading-10 text-center text-gray-800 dark:text-white">Start
                                    Conversation </h1>
                                <p className="m-3">Add users by create conversation</p>
                                <div className="m-3 w-full">
                                    <input placeholder="Search here .."
                                           className="px-3 py-2 text-white rounded-xl w-full outline-none dark:bg-dark"
                                           value={state.searchString} onChange={(event) => {
                                        updateState({searchString: event.target.value})
                                    }}/>
                                </div>
                                <div className="py-2 w-full h-64 overflow-y-auto">
                                    {state.userSearchResults.map((users: any, index) => {
                                        return (
                                            <div onClick={() => createConv(users.uid)}
                                                 key={index}
                                                 className={`visibleArrow flex items-center w-full py-2 transition-colors duration-200 hover:bg-gray-800 hover:text-white dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none cursor-pointer gap-2 px-2 rounded-xl`}>
                                                <div className="cursor-pointer flex gap-2 items-center w-full">
                                                    <img className="object-cover w-8 h-8 rounded-full"
                                                         src={users.photoURL}
                                                         alt={''}/>
                                                    <div className="text-left rtl:text-right">
                                                        <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">{users.displayName}</h1>
                                                    </div>
                                                </div>
                                                <div className="hidden">
                                                    <BiRightArrowCircle size={"1.5rem"}/>
                                                </div>
                                            </div>
                                        )
                                    })

                                    }
                                </div>
                                <div className="mt-12 md:mt-14 w-full flex justify-center">
                                    <button
                                        className="dark:text-white dark:border-white w-full sm:w-auto border border-gray-800 text-base font-medium text-gray-800 py-3 px-4 focus:outline-none hover:bg-gray-800 hover:text-white dark:hover:text-white dark:hover:bg-gray-700">
                                        Add group / Join group
                                    </button>
                                </div>
                            </div>
                            <div className="crossButton p-3 mr-3 rounded-xl cursor-pointer dark:hover:bg-gray-700"
                                 onClick={() => {
                                     updateState({showModal: false})
                                 }}>
                                <ImCross size={"1rem"}/>
                            </div>
                        </div>
                    </div>
                }
            </>
        </div>
    )
}

export default Accounts

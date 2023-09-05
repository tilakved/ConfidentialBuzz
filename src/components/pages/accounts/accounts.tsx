import "./accounts.scss"
import {BsInfoCircle, BsSearch} from "react-icons/bs";
import {
    Conversation,
    ConversationUser, createConversation,
    getAllUsersList,
    getConversationListContinuous,
    getUserDetails, User
} from "../../../API/firebase/database.ts";
import {useEffect, useState} from "react";
import {auth} from "../../../API/firebase.config.ts";
import {BiRightArrowCircle} from "react-icons/bi";
import {ImCross} from "react-icons/im";


function Accounts() {
    const [searchUsersList, setSearchUsersList] = useState<User[] | null>(null);
    const [conversationList, setConversationList] = useState<ConversationUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalShow, setModalShow] = useState(false);
    const [searchInput, setsearchInput] = useState('');

    const listHandler = async (res: Conversation[]) => {
        const conversations = res.map(i => (
            {...i, users: i.users.filter(u => u !== auth.currentUser?.uid ?? '')}
        ));
        let users: any[] = [];
        await new Promise<void>(async (resolve) => {
            for (let it of conversations) {
                await getUserDetails(it.users[0]).then(i => users.push(i));
            }
            resolve()
            setConversationList(users)
        })
    }

    useEffect(() => {
        getConversationListContinuous(listHandler).catch((err) => {
            console.error(err)
        })
    }, []);
    useEffect(() => {
        if (!modalShow) return;
        getAllUsersList(searchInput).then((usersList) => {
            setSearchUsersList(usersList)
        }).catch((err) => {
            console.error(err)
        })
    }, [modalShow, searchInput])

    function selectUser(convo: any) {
        setSelectedUser(convo)
    }

    function createConvo(user: User) {
        createConversation(user.uid).then(() => {
            setSelectedUser(user)
            setModalShow(false)
        }).catch((err) => {
            console.error(err)
        })
    }

    return (
        <div className="flex w-full">
            {/*left-sidebar*/}
            <div
                className="h-screen  overflow-y-auto bg-white border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700">
                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="p-5 text-lg font-medium text-gray-800 dark:text-white">Accounts</h2>
                        <span className="p-3 mr-3 rounded-xl cursor-pointer dark:hover:bg-gray-700"
                              onClick={() => setModalShow(true)}>
                            <BsSearch/>
                        </span>
                    </div>
                    <hr/>
                    <div className="mt-2 space-y-1">
                        {/*${selectedUser.id == arr.id ? `bg-gray-100 dark:bg-gray-800 ` : ''}*/}
                        {conversationList.map((convo: any, index: number) => {
                            return (
                                <button onClick={() => selectUser(convo)}
                                        key={index}
                                        className={`flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none ${selectedUser && selectedUser.uid === convo.uid ? `bg-gray-100 dark:bg-gray-800` : ''}`}>
                                    <img className="object-cover w-8 h-8 rounded-full"
                                         src={convo.photoURL}
                                         alt=""/>

                                    <div className="text-left rtl:text-right">
                                        <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">{convo.displayName}</h1>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">last message</p>
                                    </div>
                                </button>
                            )
                        })

                        }
                    </div>

                </div>
            </div>
            {/*right-sidebar    */}
            <div className="flex-1">
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
                                    <span
                                        className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>
                                </div>

                                <div className="text-left rtl:text-right">
                                    <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">{selectedUser?.displayName}</h1>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">online</p>
                                </div>
                            </div>
                            <div className="mr-4 p-2 rounded-xl cursor-pointer dark:hover:bg-gray-700">
                                <BsInfoCircle size={'1.2rem'}/>
                            </div>
                        </div>

                        <div>

                        </div>
                    </>
                }{!selectedUser &&
                <div
                    className="w-full flex items-center justify-between p-2 border-b dark:border-gray-700 h-full noDataFound"></div>
            }
            </div>
            {/*search popup*/}
            <>
                {modalShow &&
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
                                           className="px-3 py-2 rounded-xl w-full text-dark"
                                           value={searchInput} onChange={(event) => {
                                        setsearchInput(event.target.value)
                                    }}/>
                                </div>
                                <div className="py-2 w-full h-64 overflow-y-auto">
                                    {searchUsersList?.map((users: User, index) => {
                                        return (
                                            <div onClick={() => createConvo(users)}
                                                 key={index}
                                                 className={`visibleArrow flex items-center w-full py-2 transition-colors duration-200 hover:bg-gray-800 hover:text-white dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none cursor-pointer gap-2 px-2 rounded-xl`}>
                                                <div className="cursor-pointer flex gap-2 items-center w-full">
                                                    <img className="object-cover w-8 h-8 rounded-full"
                                                         src={users.photoURL}
                                                         alt=""/>

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
                                        add group / join group
                                    </button>
                                </div>
                            </div>
                            <div className="crossButton p-3 mr-3 rounded-xl cursor-pointer dark:hover:bg-gray-700"
                                 onClick={() => {
                                     setModalShow(false)
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

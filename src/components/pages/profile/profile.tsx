import "./profile.scss"
import {useEffect, useState} from "react";
import {getUserDetails, User} from "../../../API/firebase/database.ts";
import {successAlert} from "../../../swal/swal.ts";
import {AiOutlineEdit} from "react-icons/ai";
import {BsClipboardCheckFill} from "react-icons/bs";

function Profile() {
    const [profileUser, setProfileUser] = useState<User | null>(null)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [editProfileUser, setEditProfileUser] = useState<User | null>(null)

    useEffect(() => {
        getUserDetails().then((user: User) => {
            setProfileUser(user)
        }).catch((err) => {
            console.error(err)
        })
    }, [])

    function handleCopyClick() {
        navigator.clipboard.writeText(String(profileUser?.uid))
            .then(() => {
                successAlert('Copied', 'Copied to clipboard!');
            })
            .catch((error) => {
                successAlert('Copy failed !', error);
            });
    }

    function handleEditMode() {
        if (editMode) {
            setEditMode(false)
            let saveChanges = confirm("Do you want to save changes?")
            if (saveChanges) {
                setProfileUser(editProfileUser)
                setEditProfileUser(null)
                successAlert('Profile Updated', 'Profile changes are updated.')
            } else {
                setProfileUser(profileUser)
                setEditProfileUser(null)
            }
        } else {
            setEditMode(true)
            setEditProfileUser(profileUser)
        }
    }

    function updateData(type: string, event: any) {
        if (type == 'name') {
            if (!editProfileUser) return;
            const x = structuredClone(editProfileUser)
            x.displayName = event.target.value;
            setEditProfileUser(x);
        } else if (type == 'email') {
            if (!editProfileUser) return;
            const x = structuredClone(editProfileUser)
            x.email = event.target.value;
            setEditProfileUser(x);
        }
    }

    return (profileUser &&
        <div className="w-full h-full p-5">
            <div className="flex content-center flex-col pb-5">
                <div
                    className="w-full text-9xl text-center font-semibold titleFont uppercase">{profileUser?.displayName}</div>
                <div className="items-center flex-col content-center flex w-full">
                    <img className="h-64 mt-[-50px] rounded-full text-right" alt='' src={profileUser?.photoURL}/>
                </div>

            </div>
            <hr className={"w-96 m-auto"}/>
            <div className='w-1/2 m-auto pt-10'>
                <h1 className="text-2xl font-semibold uppercase">
                    Your Details
                </h1>
                <div className={"pt-5"}>
                    <code className="flex self-end gap-1.5 items-center">
                        UID number: <p
                        className="text-secondary ring-secondary ring-1 rounded-md p-1 bg-secondary/10 leading-none">{profileUser?.uid} </p>
                        <div
                            className="rounded-xl dark:text-white dark:border-white w-full sm:w-auto text-base font-medium text-gray-800 p-0.5 focus:outline-none hover:bg-gray-800 hover:text-white dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
                            onClick={handleCopyClick}><BsClipboardCheckFill/>
                        </div>
                    </code>
                    <div className="flex flex-col">
                        {!editMode &&
                            <>
                                <span className={"my-2"}>Your Name :- {profileUser?.displayName}</span>
                                <span className={"my-2"}>Your Email :- {profileUser?.email}</span>
                            </>
                        }
                        {editMode &&
                            <>
                            <span className={"my-2"}><p>Your Name :- </p><input value={editProfileUser?.displayName}
                                                                            onChange={(event) => updateData('name', event)}
                                                                            placeholder={'name'}
                                                                            className='text-dark rounded-xl p-2'/></span>
                                <span className={"my-2"}><p>Your Name :- </p><input value={editProfileUser?.email}
                                                                                onChange={(event) => updateData('email', event)}
                                                                                placeholder={'email'}
                                                                                className='text-dark rounded-xl p-2'/> </span>
                            </>
                        }
                        <span
                            className=" text-[12px] flex gap-2 items-center cursor-pointer rounded-xl dark:text-white dark:border-white border border-gray-800 font-medium text-gray-800 focus:outline-none hover:bg-gray-800 hover:text-white dark:hover:text-white dark:hover:bg-gray-700 w-fit p-2 my-2"
                            onClick={() => handleEditMode()}><AiOutlineEdit/>{editMode ? 'Save Changes' : 'Edit Details'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Profile

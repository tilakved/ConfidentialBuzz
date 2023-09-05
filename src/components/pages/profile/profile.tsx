import "./profile.scss"
import {useEffect, useState} from "react";
import {getUserDetails, User} from "../../../API/firebase/database.ts";

function Profile() {
    const [profileUser, setProfileUser] = useState<User | null>(null)
    useEffect(() => {
        getUserDetails().then((user: User) => {
            setProfileUser(user)
        }).catch((err) => {
            console.error(err)
        })
    }, [])
    return (
        <div className="w-full h-full p-5">
            {/*<h1 className="text-2xl titleFont uppercase">Profile</h1>*/}
            <div className="flex content-center flex-col">
                <div className="w-full text-9xl text-center font-semibold titleFont uppercase">{profileUser?.displayName}</div>
                <div className="items-center flex-col content-center flex w-full">
                    <img className="h-64 mt-[-50px] rounded-full text-right" alt='' src={profileUser?.photoURL} />
                </div>
                <code className="flex self-end gap-1.5">
                    <p className="text-secondary ring-secondary ring-1 rounded-md p-1 bg-secondary/10 leading-none ">{profileUser?.uid} </p><button>copy</button>
                </code>

            </div>
            <div className='w-1/2 m-auto'>
                Update Details:-
                <div>Your Name :- {profileUser?.displayName}</div>
                <div>Your Email :- {profileUser?.email}</div>
            </div>
        </div>
    )
}


export default Profile

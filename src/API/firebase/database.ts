import {doc, setDoc} from "firebase/firestore";
import {database} from "../firebase.config.ts"

async function addUser(user: any) {
    console.log(user, user)
    const {displayName, email, photoURL, uid} = user;
    const documentRef = doc(database, 'users', uid);
    return await setDoc(documentRef, {displayName, email, uid, photoURL})
}

export {addUser}

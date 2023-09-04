import {doc, setDoc, getDoc} from "firebase/firestore";
import {auth, database} from "../firebase.config.ts"

export interface User {
    displayName: string;
    email: string;
    photoURL:string;
    uid:string;

}

async function addUser(user: any) {
    const {displayName, email, photoURL, uid} = user;
    const documentRef = doc(database, 'users', uid);
    return await setDoc(documentRef, {displayName, email, uid, photoURL})
}

async function getUserDetails(uid: any = auth.currentUser?.uid ?? "") {

    const docRef = doc(database, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {

        return docSnap.data() as User
    } else {
        // docSnap.data() will be undefined in this case
       throw  new Error("User not found")

    }
}

export {addUser,getUserDetails }


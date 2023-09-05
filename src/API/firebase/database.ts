import {addDoc, collection, doc, getDoc, getDocs, query, setDoc, where} from "firebase/firestore";
import {auth, database} from "../firebase.config.ts"

export interface User {
    displayName: string;
    email: string;
    photoURL: string;
    uid: string;
}


export interface Conversation {
    conversationId: string;
    createdAt: number;
    users: string[];
    lastMessage: string;
}

export interface ConversationUser extends User {
    conversationId: string;
    createdAt: number;
    lastMessage: string;
}

export async function addUser(user: any) {
    const {displayName, email, photoURL, uid} = user;
    const documentRef = doc(database, 'users', uid);
    return await setDoc(documentRef, {displayName, email, uid, photoURL})
}

export async function getUserDetails(uid: any = auth.currentUser?.uid ?? "") {
    const docRef = doc(database, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as User
    } else {
        throw new Error("User not found")
    }
}

export async function createConversation(receiverId: string) {

    const convos = await getConversationList();
    const existing = convos.filter(item => item.users.includes(receiverId));
    if (existing.length) {
        return existing[0];
    }
    const conversation: Partial<Conversation> = {
        createdAt: Date.now(),
        users: [
            receiverId, auth.currentUser?.uid ?? ""
        ],
        lastMessage: "",
    }
    return await addDoc(collection(database, 'conversations'), conversation).then(item => ({...conversation, conversationId: item.id} as Conversation));
}


export async function getConversationList(): Promise<Conversation[]> {
    if (!auth.currentUser) throw new Error("User Not Found");
    const userQuery = query(collection(database, 'conversations'), where('users', 'array-contains', auth.currentUser.uid));
    const conversations = await getDocs(userQuery).then((snapshot) => snapshot.docs.map(d => ({...d.data(), conversationId: d.id} as Conversation)));
    return conversations;
}

export async function getAllUsersList(searchString: string): Promise<User[]> {
    if (!auth.currentUser) throw new Error("User Not Found");
    const docRef = collection(database, "users");
    const docSnap = await getDocs(docRef);
    let usersList = docSnap.docs.map(it => it.data())
    usersList = usersList.filter(user => auth.currentUser?.uid !== user.uid);
    usersList = usersList.filter(user => ((user.displayName).toLowerCase()).includes((searchString.trim()).toLowerCase()));
    return usersList as User[]
}

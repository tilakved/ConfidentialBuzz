import {
    addDoc,
    collection,
    doc,
    getDoc,
    orderBy,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    where,
    updateDoc,
    documentId
} from "firebase/firestore";
import {auth, database} from "../firebase.config.ts"

export interface User {
    displayName: string;
    email: string;
    photoURL: string;
    uid: string;
    lastOnline: number | "active";
}

export interface Message {
    conversationId: number;
    messageContent: string;
    senderId: string;
    createdAt: number;
    messageType: 'text' | 'file';
    isRead: boolean;
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
    return await setDoc(documentRef, {displayName, email, uid, photoURL, lastOnline: "active"})
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

export function getMultipleUsersContinuous(uids: string[], userHandler: Function): void {
    const q = query(collection(database, 'users'), where(documentId(), 'in', uids));
    onSnapshot(q, (snapshot) => {
        userHandler(snapshot.docs.map(i => ({...i.data(), uid: i.id} as User)));
    })
}

export async function updateUserOnlineStatus(status: User['lastOnline']) {
    if (!auth.currentUser) return;
    const documentRef = doc(database, 'users', auth.currentUser.uid);
    await updateDoc(documentRef, {
        lastOnline: status
    });
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
    return await getDocs(userQuery).then((snapshot) => snapshot.docs.map(d => ({...d.data(), conversationId: d.id} as Conversation)));
}

export async function getConversationListContinuous(listHandler: Function): Promise<void> {
    if (!auth.currentUser) throw new Error("User Not Found");
    const userQuery = query(collection(database, 'conversations'), where('users', 'array-contains', auth.currentUser.uid));
    onSnapshot(userQuery, (snapshot) => {
        listHandler(snapshot.docs.map(d => ({...d.data(), conversationId: d.id} as Conversation)));
    });
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

export function createMessage(conversationId: string, message: string) {
    if (!auth.currentUser) return;
    const targetConversation = doc(database, "conversations", conversationId);
    const targetCollection = collection(targetConversation, 'messages');

    const messageObj = {
        conversationId,
        messageContent: message,
        senderId: auth.currentUser.uid,
        createdAt: Date.now(),
        messageType: 'text',
        isRead: false
    }

    addDoc(targetCollection, messageObj).catch(err => {
        throw err
    })

}

export function getMessagesContinuous(conversationId: string, messageHandler: Function) {
    const targetConversation = doc(database, "conversations", conversationId);
    const targetCollection = collection(targetConversation, 'messages');
    onSnapshot(query(targetCollection, orderBy('createdAt', "asc")), (sn) => {
        messageHandler(sn.docs.map(i => i.data()))
    })

}

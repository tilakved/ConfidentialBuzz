import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    documentId,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import {User as DBUser} from 'firebase/auth'
import {auth, database} from "../firebase.config.ts"

export interface User {
    displayName: string;
    email: string;
    photoURL: string;
    uid: string;
    lastOnline: number | "active";
    conversations: string[];
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


export async function getSearchList(searchString: string): Promise<User[]> {
    if (!auth.currentUser) throw new Error("User Not Found");

    const users = await getDocs(collection(database, 'users')).then((snapshot) => snapshot.docs.map(i => ({
        ...i.data(),
        uid: i.id
    } as User)));
    const re = new RegExp(searchString, 'i');
    return users.filter(i => i.uid !== auth.currentUser?.uid && re.test(i.displayName + "" + i.email + "" + i.uid));
}

export async function addUser(user: DBUser) {
    const {displayName, email, photoURL, uid} = user;
    const documentRef = doc(database, 'users', uid);
    return await setDoc(documentRef, {displayName, email, uid, photoURL, lastOnline: "active", conversations: []})
}


export async function createConversation(receiverId: string) {
    if (!auth.currentUser) return;
    const conversation: Omit<Conversation, 'conversationId'> = {
        users: [auth.currentUser.uid, receiverId],
        createdAt: Date.now(),
        lastMessage: "",
    }
    const conversationId = await addDoc(collection(database, 'conversations'), conversation).then((res) => res.id).catch((err) => {
        throw err
    });
    await updateDoc(doc(database, 'users', auth.currentUser.uid), {conversations: arrayUnion(conversationId)});
    return conversationId
}

export async function getConversationListContinuous(snapConservationList: Function) {
    if (!auth.currentUser) return;
    const currentUserUid = auth.currentUser.uid;

//     get continuous conversation ids from user
    onSnapshot(doc(database, 'users', currentUserUid), async (snapshot) => {
        const userData: User | undefined = snapshot.data() as User;
        if (!userData) return;
        const userConvos = userData.conversations;
        if (userConvos.length === 0) return;
        const convosQuery = query(collection(database, 'conversations'), where(documentId(), 'in', userConvos));
        const convos: Conversation[] = await getDocs(convosQuery).then(res => res.docs.map(i => ({
            ...i.data(),
            conversationId: i.id
        } as Conversation)));
        const convosUserIds = convos.map(i => i.users.find(usrid => usrid !== currentUserUid) ?? '').filter(f => !!f.length);
        const convosUserQuery = query(collection(database, 'users'), where(documentId(), 'in', convosUserIds))
        onSnapshot(convosUserQuery, snapshot1 => {
             const data = snapshot1.docs.map(i => {
                const Obj: any = {...i.data(), uid: i.id, ...convos.find(c => c.users.includes(i.id))}
                delete Obj.conversations
                delete Obj.users
                return Obj as ConversationUser;
            });
            snapConservationList(data)
        })
    })
}

export async function getUserDetails(uid: any = auth.currentUser?.uid ?? "") {
    const userQuery2 = query(collection(database, 'users'), where('uid', '==', uid));
    onSnapshot(userQuery2, (snapshot2) => {
        return (snapshot2.docs.map(d => {
            return d.data()
        }))
    })
}


//  FINALIZED

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

// export async function createConversation(receiverId: string) {
//     const convos = await getConversationList();
//     const existing = convos.filter(item => item.users.includes(receiverId));
//     if (existing.length) {
//         return existing[0];
//     }
//     const conversation: Partial<Conversation> = {
//         createdAt: Date.now(),
//         users: [
//             receiverId, auth.currentUser?.uid ?? ""
//         ],
//         lastMessage: "",
//     }
//     return await addDoc(collection(database, 'conversations'), conversation).then(item => ({...conversation, conversationId: item.id} as Conversation));
// }

export async function getConversationList(): Promise<Conversation[]> {
    if (!auth.currentUser) throw new Error("User Not Found");
    const userQuery = query(collection(database, 'conversations'), where('users', 'array-contains', auth.currentUser.uid));
    return await getDocs(userQuery).then((snapshot) => snapshot.docs.map(d => ({
        ...d.data(),
        conversationId: d.id
    } as Conversation)));
}

// export async function getConversationListContinuous(listHandler: Function): Promise<void> {
//     if (!auth.currentUser) throw new Error("User Not Found");
//     const userQuery = query(collection(database, 'conversations'), where('users', 'array-contains', auth.currentUser.uid));
//     onSnapshot(userQuery, (snapshot) => {
//         listHandler(snapshot.docs.map(d => ({...d.data(), conversationId: d.id} as Conversation)));
//     });
// }

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

let cancelCurrentSnapshot: ReturnType<typeof onSnapshot> | null = null;

export function getMessagesContinuous(conversationId: string, messageHandler: Function) {
    const targetConversation = doc(database, "conversations", conversationId);
    const targetCollection = collection(targetConversation, 'messages');
    if (cancelCurrentSnapshot !== null) {
        cancelCurrentSnapshot();
        cancelCurrentSnapshot = null;
    }
    cancelCurrentSnapshot = onSnapshot(query(targetCollection, orderBy('createdAt', "asc")), (sn) => {
        messageHandler(sn.docs.map(i => i.data()))
    })

}

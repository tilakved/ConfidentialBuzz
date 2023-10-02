import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    documentId,
    getDocs,
    onSnapshot,
    query,
    getDoc,
    orderBy,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import {User as DBUser} from 'firebase/auth'
import {auth, database} from "../firebase.config.ts"
import {failAlert} from "../../swal/swal.ts";

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

export async function getSearchList(searchString: string, handleSearchList: Function) {
    if (!auth.currentUser) {
        failAlert('User not found', 'Please try again later!')
        throw new Error("User Not Found")
    }
    ;
    onSnapshot(collection(database, 'users'), async (snapshot) => {
        const dt = snapshot.docs.map(i => ({
            ...i.data(),
            uid: i.id
        } as User))
        const re = new RegExp(searchString, 'i');
        const filteredUser = dt.filter(i => i.uid !== auth.currentUser?.uid && re.test(i.displayName + "" + i.email + "" + i.uid));
        handleSearchList(filteredUser)
    })
}

export async function addUser(user: DBUser) {
    const {displayName, email, photoURL, uid} = user;
    const documentRef = doc(database, 'users', uid);
    if (await getDoc(documentRef).then(i => i.exists())) return;
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
    await updateDoc(doc(database, 'users', receiverId), {conversations: arrayUnion(conversationId)});
    return conversationId
}

export async function getConversationListContinuous(snapConservationList: Function) {
    if (!auth.currentUser) return;
    const currentUserUid = auth.currentUser.uid;
    let cancelSnapshot!: ReturnType<typeof onSnapshot>;
    // get continuous conversation ids from user
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

        if (cancelSnapshot) {
            cancelSnapshot()
        }
        cancelSnapshot = onSnapshot(convosUserQuery, snapshot1 => {
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
    const userData = await getDoc(doc(database, "users", uid));
    if (userData.exists()) {
        return userData.data() as User
    } else {
        failAlert('User not found', 'Please try again later!')
        throw new Error("User not found")
    }
}

export async function updateUserOnlineStatus(status: User['lastOnline']) {
    if (!auth.currentUser) return;
    const documentRef = doc(database, 'users', auth.currentUser.uid);
    await updateDoc(documentRef, {
        lastOnline: status
    });
}

export async function createMessage(conversationId: string, message: string) {
    if (!auth.currentUser) return;
    const messageObj = {
        conversationId,
        messageContent: message,
        senderId: auth.currentUser.uid,
        createdAt: Date.now(),
        messageType: 'text',
        isRead: false
    }
    await addDoc(collection(database, 'messages'), messageObj).catch(err => {
        throw err
    }).then(async () => {
        await updateDoc(doc(database, 'conversations', conversationId), {lastMessage: message})
    })
}

let cancelSnapshotMessage!: ReturnType<typeof onSnapshot>;

export async function getMessageLists(conversationId: string, updateMessageList: Function) {
    const messageQuery = query(collection(database, 'messages'), where('conversationId', "==", conversationId), orderBy('createdAt', 'asc'))
    if (cancelSnapshotMessage) {
        cancelSnapshotMessage()
    }
    cancelSnapshotMessage = onSnapshot(messageQuery, snapshot => {
        const messages = snapshot.docs.map(i => ({...i.data(), uid: i.id}))
        updateMessageList(messages)
    })
}

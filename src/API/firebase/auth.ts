import {
    fetchSignInMethodsForEmail,
    sendEmailVerification,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import {auth} from '../firebase.config.ts';

export async function isUserExist(email: string) {
    let signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0;
}

export async function loginWithPassword(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        return userCredential.user;
    }).catch((error) => {
        throw error;
    });
}

export async function signUpWithPassword(email: string, password: string, name: string) {
    return await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        await updateProfile(userCredential.user, {displayName: name})
        return userCredential.user;
    }).catch((error) => {
        throw error;
    });
}

export async function sendVerifyEmailAuth() {
    if (!auth.currentUser) return
    await sendEmailVerification(auth.currentUser).then((res) => {
        console.log('MAIL SENT', res);
        auth.signOut();
    });
}


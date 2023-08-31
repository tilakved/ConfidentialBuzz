import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWrLvNpxU-UDzHEpoiDfnJrx0XYKrb6Fk",
    authDomain: "confidential-buzz.firebaseapp.com",
    projectId: "confidential-buzz",
    storageBucket: "confidential-buzz.appspot.com",
    messagingSenderId: "1086700276719",
    appId: "1:1086700276719:web:da872f94cca146006e441a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const auth  = getAuth(app)

export default app;
export {database,auth}

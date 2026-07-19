import {

    getAuth,

    signInWithEmailAndPassword,

    createUserWithEmailAndPassword,

    signOut,

    onAuthStateChanged

} from "firebase/auth";

import { app } from "./firebase.init.js";

export const auth = getAuth(app);

export {

    signInWithEmailAndPassword,

    createUserWithEmailAndPassword,

    signOut,

    onAuthStateChanged

};

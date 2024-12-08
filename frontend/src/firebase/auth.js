import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}
export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider(); // Use 'new' to create an instance
    const result = await signInWithPopup(auth, provider);
    return result;
};

export const doSignOut = () => {
    return auth.signOut()
}
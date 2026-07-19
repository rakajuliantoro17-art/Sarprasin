// ======================================================
// Firebase Authentication Service
// Sarprasin v2.0
// ======================================================

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "firebase/auth";

import { app } from "./config.js";

const auth = getAuth(app);

/**
 * Login menggunakan Email & Password
 */
export async function login(email, password) {
    try {

        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        return {
            success: true,
            user: credential.user
        };

    } catch (error) {

        return {
            success: false,
            code: error.code,
            message: error.message
        };

    }
}

/**
 * Logout
 */
export async function logout() {

    try {

        await signOut(auth);

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false,
            message: error.message
        };

    }

}

/**
 * Reset Password
 */
export async function resetPassword(email) {

    try {

        await sendPasswordResetEmail(auth, email);

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false,
            message: error.message
        };

    }

}

/**
 * Mendapatkan user yang sedang login
 */
export function getCurrentUser() {

    return auth.currentUser;

}

/**
 * Listener perubahan status login
 */
export function authListener(callback) {

    return onAuthStateChanged(auth, callback);

}

/**
 * Export Auth Instance
 */
export { auth };

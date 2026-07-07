// ======================================================
// Authentication Service
// Sarprasin v2.0
// ======================================================

import {
    login,
    logout,
    resetPassword,
    authListener,
    getCurrentUser
} from "../firebase";

import {
    getCurrentProfile,
    updateUser
} from "../core/user.service.js";

import {
    createLog,
    LOG_ACTION
} from "../core/log.service.js";

import {
    trackEvent,
    EVENTS
} from "../firebase";

/* ======================================================
   LOGIN
====================================================== */

export async function signIn(email, password) {

    const credential = await login(email, password);

    const profile = await getCurrentProfile();

    if (!profile) {

        throw new Error("Profil pengguna tidak ditemukan.");

    }

    if (profile.status !== "aktif") {

        await logout();

        throw new Error("Akun tidak aktif.");

    }

    await updateUser(profile.uid, {

        lastLogin: new Date().toISOString()

    });

    await createLog({

        action: LOG_ACTION.LOGIN,

        description: "Login berhasil"

    });

    trackEvent(EVENTS.LOGIN);

    return {

        auth: credential.user,

        profile

    };

}

/* ======================================================
   LOGOUT
====================================================== */

export async function signOut() {

    await createLog({

        action: LOG_ACTION.LOGOUT,

        description: "Logout"

    });

    trackEvent(EVENTS.LOGOUT);

    await logout();

}

/* ======================================================
   RESET PASSWORD
====================================================== */

export async function forgotPassword(email) {

    await resetPassword(email);

}

/* ======================================================
   CURRENT USER
====================================================== */

export function currentUser() {

    return getCurrentUser();

}

/* ======================================================
   AUTH STATE
====================================================== */

export function onAuthChanged(callback) {

    return authListener(callback);

}

/* ======================================================
   CHECK LOGIN
====================================================== */

export function isAuthenticated() {

    return getCurrentUser() !== null;

}

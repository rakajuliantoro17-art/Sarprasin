// ======================================================
// Session Service
// Sarprasin v2.0
// ======================================================

import { currentUser } from "./auth.service.js";
import { getProfile } from "./profile.service.js";

/* ======================================================
   SESSION CACHE
====================================================== */

let session = null;

/* ======================================================
   CREATE SESSION
====================================================== */

export async function createSession() {

    const auth = currentUser();

    if (!auth) {

        session = null;
        return null;

    }

    const profile = await getProfile();

    session = {

        uid: auth.uid,

        email: auth.email,

        profile,

        loginAt: new Date().toISOString(),

        lastActivity: Date.now()

    };

    return session;

}

/* ======================================================
   GET SESSION
====================================================== */

export async function getSession() {

    if (!session) {

        await createSession();

    }

    return session;

}

/* ======================================================
   REFRESH SESSION
====================================================== */

export async function refreshSession() {

    session = null;

    return await createSession();

}

/* ======================================================
   UPDATE ACTIVITY
====================================================== */

export function updateActivity() {

    if (!session) return;

    session.lastActivity = Date.now();

}

/* ======================================================
   GET LAST ACTIVITY
====================================================== */

export function getLastActivity() {

    return session?.lastActivity || null;

}

/* ======================================================
   SESSION AGE
====================================================== */

export function getSessionAge() {

    if (!session) return 0;

    return Date.now() - session.lastActivity;

}

/* ======================================================
   CHECK ACTIVE
====================================================== */

export function isSessionActive(timeout = 30 * 60 * 1000) {

    if (!session) return false;

    return (Date.now() - session.lastActivity) < timeout;

}

/* ======================================================
   CLEAR SESSION
====================================================== */

export function clearSession() {

    session = null;

}

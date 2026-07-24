/*
==================================================

AUTH SERVICE

==================================================
*/


import {

login as firebaseLogin,

logout as firebaseLogout,

getById,

COLLECTION

}

from "../firebase/index.js";

import {

setUser,

logoutUser

}

from "../../store/auth.store.js";

import {

saveSession,

clearSession,

getSession

}

from "./session.service.js";



// Kemana user diarahkan setelah login, berdasarkan role.
// Sesuai pemetaan 4 dashboard (lihat src/router/routes.js).
const ROLE_REDIRECT = {

    admin: "/admin",
    waka_sarpras: "/admin",
    staff: "/admin",
    arsiparis: "/admin",

    operator: "/user",
    guru: "/user",
    wali_kelas: "/user",
    viewer: "/user"

};




export async function login(

email,

password

){


const authUser =
await firebaseLogin(email, password);


const profileSnap =
await getById(COLLECTION.USERS, authUser.uid);


if (!profileSnap.exists()) {

    await firebaseLogout();

    throw new Error(
        "Akun ini belum terdaftar sebagai user aplikasi. Hubungi admin."
    );

}


const profile =
profileSnap.data();


const user = {

    uid: authUser.uid,
    email: authUser.email,
    role: profile.role,
    name: profile.name || authUser.email

};


setUser(user);

saveSession(user);


window.location.href =
ROLE_REDIRECT[user.role] || "/user";


return user;


}




export async function logout(){


await firebaseLogout();

logoutUser();

clearSession();


window.location.href = "/login";


}


export function getCurrentUser(){


return getSession();


}

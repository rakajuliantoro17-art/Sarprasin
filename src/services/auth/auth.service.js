/*
==================================================

AUTH SERVICE

==================================================
*/


import {

saveSession,

clearSession,

getSession

}

from "./session.service.js";





export async function login(

email,

password

){



/*

Firebase Auth nanti

*/


const user={


email,


role:"ADMIN_SARPRAS"


};





saveSession(user);



return user;


}






export function logout(){



clearSession();


location.href="/login";


}


export function getCurrentUser(){


    return getSession();


}

/*
==================================================
Catatan fungsi lain yang direncanakan untuk service
ini (belum diimplementasikan, dokumentasi saja):

    register(email, password)
    forgotPassword(email)
    refreshSession()
==================================================
*/

/*
==================================================

AUTH SERVICE

==================================================
*/


import {

saveSession,

clearSession

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
login(email,password)

logout()

register()

forgotPassword()

refreshSession()

getCurrentUser()

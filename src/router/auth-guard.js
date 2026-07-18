/*
==================================================
SARPRASIN v2.0

AUTH GUARD

Firebase Authentication Middleware

Version : 2.0.0

==================================================
*/


import {

auth

}

from "../config/firebase.js";



import {

onAuthStateChanged,
signOut

}

from "firebase/auth";



import {

authStore

}

from "../store/index.js";






/*
==================================================
CHECK AUTH STATE

Return:
- user object
- null

==================================================
*/


export function checkAuth(){



return new Promise(

(resolve)=>{



const unsubscribe =

onAuthStateChanged(

auth,

(user)=>{





if(user){



authStore.setUser(user);



resolve(user);



}

else{



authStore.logout();



resolve(null);



}





unsubscribe();



}



);



}


);



}









/*
==================================================
REQUIRE AUTH

Proteksi halaman

==================================================
*/


export async function requireAuth(){



const user =

await checkAuth();





if(!user){



redirectLogin();


return false;



}





return true;


}









/*
==================================================
LOGIN REDIRECT

==================================================
*/


function redirectLogin(){



const currentPath =

encodeURIComponent(

window.location.pathname

);





window.location.href =


`/public/login.html?redirect=${currentPath}`;



}









/*
==================================================
GET CURRENT USER

==================================================
*/


export function getCurrentUser(){



return auth.currentUser;


}









/*
==================================================
LOGOUT HANDLER

==================================================
*/


export async function logoutUser(){



try{



await signOut(auth);



authStore.logout();





window.location.href =

"/public/login.html";



}



catch(error){



console.error(

"Logout failed:",

error

);



}



}









/*
==================================================
CHECK SESSION

Dipanggil saat aplikasi load

==================================================
*/


export function initAuthListener(){



onAuthStateChanged(

auth,

(user)=>{



if(user){



authStore.setUser(user);


}

else{


authStore.logout();


}



}



);



}

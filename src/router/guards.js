/*
==================================================
AUTH GUARD

==================================================
*/


import {

auth

}

from "../config/firebase.js";



import {

onAuthStateChanged

}

from "firebase/auth";






export function checkAuth(){



return new Promise(

resolve=>{


onAuthStateChanged(

auth,

user=>{


resolve(user);


}

);


}

);



}

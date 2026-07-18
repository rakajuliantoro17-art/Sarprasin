/*
==========================================================
SARPRASIN v2.0

LOGIN CONTROLLER

Version : 1.0.0
==========================================================
*/


import {

auth

}

from "../../services/firebase/index.js";



import {

signInWithEmailAndPassword

}

from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



import {

getRouteByName

}

from "../../config/routes.js";





const form = 
document.getElementById(
"loginForm"
);



const message =
document.getElementById(
"loginMessage"
);





form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const email =
document.getElementById(
"email"
).value;



const password =
document.getElementById(
"password"
).value;



try{


message.innerHTML =
"Memproses login...";



const result =
await signInWithEmailAndPassword(
auth,
email,
password
);



const user =
result.user;



localStorage.setItem(
"sarprasin_user",
JSON.stringify({

uid:user.uid,

email:user.email

})
);




message.innerHTML =
"Login berhasil...";



setTimeout(()=>{


window.location.href =
"/dashboard";


},1000);



}

catch(error){



message.innerHTML =
"Email atau password salah";


console.error(error);


}



});

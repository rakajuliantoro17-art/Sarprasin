/*
==================================================

NOTIFICATION SERVICE

==================================================
*/


import {

addNotification

}

from "../../store/notification.store.js";






export function notify(

data

){



const notification={



id:

Date.now(),



read:false,



createdAt:

new Date(),



...data



};





addNotification(

notification

);



return notification;


}









export function success(

message

){



return notify({

type:"SYSTEM",

title:"Berhasil",

message,

priority:"NORMAL"


});


}









export function error(

message

){



return notify({

type:"SYSTEM",

title:"Error",

message,

priority:"HIGH"


});


}

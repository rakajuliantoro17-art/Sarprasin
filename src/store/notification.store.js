/*
==================================================

NOTIFICATION STORE

==================================================
*/


import {

createStore,

setState,

getState

}

from "./index.js";





createStore(

"notification",

{


items:[]


}

);






export function addNotification(

message,

type="info"

){



const state=

getState(

"notification"

);





setState(

"notification",

{


items:[

...state.items,

{


id:Date.now(),

message,

type

}

]


}

);



}






export function clearNotification(){



setState(

"notification",

{


items:[]

}

);


}

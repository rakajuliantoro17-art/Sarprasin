/*
==================================================

SARPRASIN v2.0

HEALTH SERVICE

Application Health Monitoring

Version : 2.0.0

==================================================
*/


import {

isOnline

}

from "./network.service.js";









/*
==================================================
SYSTEM STATUS

==================================================
*/


const status = {


application:"unknown",

network:"unknown",

firebase:"unknown",

api:"unknown",

storage:"unknown"

};









/*
==================================================
CHECK NETWORK

==================================================
*/


export async function checkNetwork(){


const online =

isOnline();





status.network =

online

?

"healthy"

:

"offline";





return status.network;


}









/*
==================================================
CHECK STORAGE

Local Storage

==================================================
*/


export function checkStorage(){



try{


localStorage.setItem(

"health_check",

"ok"

);



localStorage.removeItem(

"health_check"

);





status.storage=

"healthy";



}

catch(error){



status.storage=

"failed";


}



return status.storage;


}









/*
==================================================
CHECK API

==================================================
*/


export async function checkAPI(

url

){


try{


const response=

await fetch(

url,

{

method:"HEAD",

cache:"no-cache"

}

);





status.api=

response.ok

?

"healthy"

:

"failed";



}

catch(error){



status.api=

"failed";


}



return status.api;


}









/*
==================================================
CHECK FIREBASE

==================================================
*/


export async function checkFirebase(

firebaseInstance

){



try{


if(

firebaseInstance

){


status.firebase=

"healthy";


}

else{


status.firebase=

"not-configured";


}



}

catch(error){


status.firebase=

"failed";


}





return status.firebase;


}









/*
==================================================
PERFORMANCE CHECK

==================================================
*/


export function checkPerformance(){



if(

!window.performance

)

return null;





const navigation=

performance.getEntriesByType(

"navigation"

)[0];





return{


loadTime:

navigation.loadEventEnd -

navigation.startTime,



domReady:

navigation.domContentLoadedEventEnd -

navigation.startTime



};


}









/*
==================================================
FULL HEALTH CHECK

==================================================
*/


export async function healthCheck(

options={}

){



await checkNetwork();



checkStorage();



if(options.api){


await checkAPI(

options.api

);


}



if(options.firebase){


await checkFirebase(

options.firebase

);


}





status.application=

"healthy";





return{


status:

{

...status

},


performance:

checkPerformance(),


timestamp:

new Date()

};


}









/*
==================================================
GET CURRENT STATUS

==================================================
*/


export function getHealthStatus(){


return{


...status

};


}

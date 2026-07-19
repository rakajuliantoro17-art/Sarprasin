/*
==================================================

PUSH NOTIFICATION SERVICE

==================================================
*/


export async function requestPermission(){



if(

!"Notification" in window

)

return false;





const permission=

await Notification.requestPermission();





return permission==="granted";


}







export function sendBrowserNotification(

title,

message

){



if(

Notification.permission==="granted"

){



new Notification(

title,

{


body:message


}

);



}



}

/*
==================================================

NOTIFICATION QUEUE

==================================================
*/


const queue=[];



export function addQueue(

notification

){



queue.push(

notification

);


}





export function processQueue(){



while(

queue.length

){



const item=

queue.shift();



console.log(

"Process",

item

);



}



}

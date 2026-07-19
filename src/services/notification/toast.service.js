/*
==================================================

TOAST SERVICE

==================================================
*/


export function showToast(

message,

type="info"

){



const container=

document.getElementById(

"toast-container"

);



if(!container)

return;





const toast=

document.createElement(

"div"

);



toast.className=

`toast ${type}`;



toast.innerHTML=

message;





container.appendChild(

toast

);





setTimeout(

()=>{


toast.remove();


},

3000

);


}

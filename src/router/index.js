/*
==================================================
SARPRASIN v2.0

MAIN ROUTER

==================================================
*/


import {

routes

}

from "./routes.js";



import {

checkAuth

}

from "./auth-guard.js";



import {

checkRole

}

from "./role-guard.js";







export async function navigate(path){



const route =

routes.find(

item=>item.path===path

);





if(!route){


location.href=

"/public/404.html";


return;


}







if(route.auth){



const user =

await checkAuth();



if(!user){


location.href=

"/public/login.html";


return;


}



}








if(route.role){


const allowed =

await checkRole(
route.role
);



if(!allowed){


location.href=

"/public/unauthorized.html";


return;


}



}







location.href=

route.page;


}

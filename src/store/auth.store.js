import {

getSession

}

from "../services/auth/session.service.js";




let user=null;



export function initAuth(){


user=

getSession();


}



export function getCurrentUser(){


return user;


}



export function setUser(

data

){


user=data;


}

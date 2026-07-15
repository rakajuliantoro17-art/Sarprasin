/*
==========================================================
SARPRASIN v2.0
SMANSASOO Digital System

Application Routes Configuration
Version : 1.0.0
==========================================================
*/


import {
    USER_ROLE
}
from "./constant.js";




// ======================================================
// PUBLIC ROUTES
// ======================================================

export const PUBLIC_ROUTES = [


    {

        name:
        "Login",

        path:
        "/login",

        page:
        "login",

        title:
        "Login - SARPRASIN",

        auth:
        false

    },


    {

        name:
        "Home",

        path:
        "/",

        page:
        "home",

        title:
        "SARPRASIN v2.0",

        auth:
        false

    }


];





// ======================================================
// MAIN APPLICATION ROUTES
// ======================================================

export const APP_ROUTES = [


    {

        name:
        "Dashboard",

        path:
        "/dashboard",

        page:
        "dashboard",

        title:
        "Dashboard",

        icon:
        "layout-dashboard",

        auth:
        true,

        roles:
        [

            USER_ROLE.ADMIN,

            USER_ROLE.WAKA_SARPRAS,

            USER_ROLE.OPERATOR,

            USER_ROLE.STAFF

        ]

    },



    {

        name:
        "Asset",

        path:
        "/asset",

        page:
        "asset",

        title:
        "Asset Management",

        icon:
        "package",

        auth:
        true,

        roles:
        [

            USER_ROLE.ADMIN,

            USER_ROLE.WAKA_SARPRAS,

            USER_ROLE.OPERATOR,

            USER_ROLE.STAFF

        ]

    },



    {

        name:
        "Room",

        path:
        "/room",

        page:
        "room",

        title:
        "Room Management",

        icon:
        "building",

        auth:
        true,

        roles:
        [

            USER_ROLE.ADMIN,

            USER_ROLE.WAKA_SARPRAS,

            USER_ROLE.OPERATOR

        ]

    },



    {

        name:
        "Maintenance",

        path:
        "/maintenance",

        page:
        "maintenance",

        title:
        "Maintenance",

        icon:
        "wrench",

        auth:
        true,

        roles:
        [

            USER_ROLE.ADMIN,

            USER_ROLE.WAKA_SARPRAS,

            USER_ROLE.STAFF

        ]

    },



    {

        name:
        "Report",

        path:
        "/report",

        page:
        "report",

        title:
        "Report",

        icon:
        "file-text",

        auth:
        true,

        roles:
        [

            USER_ROLE.ADMIN,

            USER_ROLE.WAKA_SARPRAS,

            USER_ROLE.OPERATOR

        ]

    },


    {

        name:
        "Executive",

        path:
        "/executive",

        page:
        "executive",

        title:
        "Executive Dashboard",

        icon:
        "chart-no-axes-combined",

        auth:
        true,

        roles:
        [

            USER_ROLE.ADMIN,

            USER_ROLE.WAKA_SARPRAS

        ]

    },


    {

        name:
        "Profile",

        path:
        "/profile",

        page:
        "profile",

        title:
        "User Profile",

        icon:
        "user",

        auth:
        true,

        roles:
        [

            USER_ROLE.ADMIN,

            USER_ROLE.WAKA_SARPRAS,

            USER_ROLE.OPERATOR,

            USER_ROLE.STAFF,

            USER_ROLE.GURU

        ]

    },


    {

        name:
        "Settings",

        path:
        "/settings",

        page:
        "settings",

        title:
        "System Settings",

        icon:
        "settings",

        auth:
        true,

        roles:
        [

            USER_ROLE.ADMIN

        ]

    }


];





// ======================================================
// ERROR ROUTES
// ======================================================

export const ERROR_ROUTES = [


    {

        name:
        "Not Found",

        path:
        "*",

        page:
        "404",

        title:
        "Page Not Found"


    },


    {

        name:
        "Maintenance",

        path:
        "/system-maintenance",

        page:
        "maintenance",

        title:
        "System Maintenance"

    }


];





// ======================================================
// ROUTE HELPERS
// ======================================================


export function getRouteByPath(path){


    return [

        ...PUBLIC_ROUTES,

        ...APP_ROUTES,

        ...ERROR_ROUTES

    ]

    .find(

        route =>
        route.path === path

    );


}




export function getRouteByName(name){


    return [

        ...PUBLIC_ROUTES,

        ...APP_ROUTES,

        ...ERROR_ROUTES

    ]

    .find(

        route =>
        route.name === name

    );


}





export function checkRouteAccess(
    route,
    userRole
){


    if(!route.auth){

        return true;

    }



    if(!route.roles){

        return false;

    }



    return route.roles.includes(
        userRole
    );


}

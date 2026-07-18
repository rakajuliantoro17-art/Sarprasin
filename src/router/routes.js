/*
==================================================
SARPRASIN v2.0

ROUTE CONFIGURATION

==================================================
*/


export const routes = [



// =====================
// PUBLIC
// =====================


{
path:"/",
page:"/public/landing.html",
public:true
},



{
path:"/login",
page:"/public/login.html",
public:true
},



{
path:"/register",
page:"/public/register.html",
public:true
},



{
path:"/status",
page:"/public/status.html",
public:true
},



{
path:"/version",
page:"/public/version.html",
public:true
},



{
path:"/release-notes",
page:"/public/release-notes.html",
public:true
},







// =====================
// DASHBOARD
// =====================


{
path:"/dashboard",
page:"/pages/dashboard/index.html",
auth:true
},







// =====================
// ADMIN
// =====================


{
path:"/admin",
page:"/pages/admin/index.html",
auth:true,
role:"admin"
},







// =====================
// EXECUTIVE
// =====================


{
path:"/executive",
page:"/pages/executive/index.html",
auth:true,
role:"executive"
},







// =====================
// STAFF
// =====================


{
path:"/staff",
page:"/pages/staff/index.html",
auth:true,
role:"staff"
}





];

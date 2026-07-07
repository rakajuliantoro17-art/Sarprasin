// ======================================================
// Permission Service
// Sarprasin v2.0
// ======================================================

import { getCurrentProfile } from "../core/user.service.js";

/* ======================================================
   PERMISSION
====================================================== */

export const PERMISSION = {

    /* Asset */

    ASSET_CREATE: "asset.create",

    ASSET_READ: "asset.read",

    ASSET_UPDATE: "asset.update",

    ASSET_DELETE: "asset.delete",

    /* Dashboard */

    DASHBOARD_PUBLIC: "dashboard.public",

    DASHBOARD_EXECUTIVE: "dashboard.executive",

    DASHBOARD_ADMIN: "dashboard.admin",

    /* Master */

    MASTER_MANAGE: "master.manage",

    /* User */

    USER_MANAGE: "user.manage",

    /* Report */

    REPORT_EXPORT: "report.export",

    /* Backup */

    BACKUP_MANAGE: "backup.manage",

    /* AI */

    AI_MANAGE: "ai.manage"

};

/* ======================================================
   GET PERMISSIONS
====================================================== */

export async function getPermissions() {

    const profile = await getCurrentProfile();

    return profile?.permissions || [];

}

/* ======================================================
   HAS PERMISSION
====================================================== */

export async function hasPermission(permission) {

    const permissions = await getPermissions();

    return permissions.includes(permission);

}

/* ======================================================
   HAS ANY
====================================================== */

export async function hasAnyPermission(...permissions) {

    const owned = await getPermissions();

    return permissions.some(p => owned.includes(p));

}

/* ======================================================
   HAS ALL
====================================================== */

export async function hasAllPermissions(...permissions) {

    const owned = await getPermissions();

    return permissions.every(p => owned.includes(p));

}

/* ======================================================
   REQUIRE PERMISSION
====================================================== */

export async function requirePermission(permission) {

    const allowed = await hasPermission(permission);

    if (!allowed) {

        throw new Error("PERMISSION_DENIED");

    }

    return true;

}

/* ======================================================
   REQUIRE ANY
====================================================== */

export async function requireAnyPermission(...permissions) {

    const allowed = await hasAnyPermission(...permissions);

    if (!allowed) {

        throw new Error("PERMISSION_DENIED");

    }

    return true;

}

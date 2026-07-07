// ======================================================
// Firebase Analytics Service
// Sarprasin v2.0
// ======================================================

import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { app } from "./config.js";

let analytics = null;

/* ======================================================
   INIT ANALYTICS
====================================================== */

export async function initAnalytics() {

    try {

        const supported = await isSupported();

        if (supported) {
            analytics = getAnalytics(app);
        }

    } catch (error) {

        console.warn("Firebase Analytics tidak tersedia.", error);

    }

}

/* ======================================================
   TRACK EVENT
====================================================== */

export function trackEvent(eventName, parameters = {}) {

    if (!analytics) return;

    logEvent(analytics, eventName, parameters);

}

/* ======================================================
   COMMON EVENTS
====================================================== */

export const EVENTS = {

    LOGIN: "login",

    LOGOUT: "logout",

    VIEW_DASHBOARD: "view_dashboard",

    CREATE_ASSET: "create_asset",

    UPDATE_ASSET: "update_asset",

    DELETE_ASSET: "delete_asset",

    VIEW_ASSET: "view_asset",

    SEARCH_ASSET: "search_asset",

    UPLOAD_PHOTO: "upload_photo",

    GENERATE_QR: "generate_qr",

    EXPORT_REPORT: "export_report",

    DOWNLOAD_REPORT: "download_report"

};

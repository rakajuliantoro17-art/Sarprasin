// ======================================================
// Firebase Service Barrel Export
// Sarprasin v2.0
// ======================================================

/* ======================================================
   CONFIG
====================================================== */

export {
    app,
    auth,
    db,
    storage
} from "./config.js";

/* ======================================================
   AUTH
====================================================== */

export {
    login,
    logout,
    resetPassword,
    getCurrentUser,
    authListener
} from "./auth.js";

/* ======================================================
   FIRESTORE
====================================================== */

export {
    COLLECTION,
    getAll,
    getById,
    create,
    createWithId,
    update,
    remove,
    getWhere,
    getOrdered,
    getLimited
} from "./firestore.js";

/* ======================================================
   STORAGE
====================================================== */

export {
    STORAGE,
    uploadFile,
    uploadFileWithProgress,
    deleteFile
} from "./storage.js";

/* ======================================================
   ANALYTICS
====================================================== */

export {
    initAnalytics,
    trackEvent,
    EVENTS
} from "./analytics.js";

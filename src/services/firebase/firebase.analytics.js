import {

    getAnalytics,

    isSupported

}

from "firebase/analytics";

import { app } from "./firebase.init.js";

let analytics = null;

export async function initializeAnalytics() {

    if (await isSupported()) {

        analytics = getAnalytics(app);

        console.info("Analytics Ready");

    }

    return analytics;

}

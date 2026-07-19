import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./firebase.config.js";

export const app = initializeApp(firebaseConfig);

console.log(
    "🔥 Firebase Connected:",
    app.options.projectId
);

import {

    getStorage,

    ref,

    uploadBytes,

    getDownloadURL,

    deleteObject

}

from "firebase/storage";

import { app } from "./firebase.init.js";

export const storage = getStorage(app);

export {

    ref,

    uploadBytes,

    getDownloadURL,

    deleteObject

};

// ======================================================
// Firebase Storage Service
// Sarprasin v2.0
// ======================================================

import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "firebase/storage";

import { storage } from "./config.js";

/* ======================================================
   FOLDER
====================================================== */

export const STORAGE = {

    ASSETS: "assets",

    DOCUMENTS: "documents",

    MANUALS: "manuals",

    REPORTS: "reports",

    TEMP: "temp"

};

/* ======================================================
   UPLOAD FILE
====================================================== */

export async function uploadFile(
    folder,
    fileName,
    file
) {

    try {

        const storageRef = ref(
            storage,
            `${folder}/${fileName}`
        );

        await uploadBytes(storageRef, file);

        const url = await getDownloadURL(storageRef);

        return {
            success: true,
            url
        };

    } catch (error) {

        return {
            success: false,
            message: error.message
        };

    }

}

/* ======================================================
   UPLOAD WITH PROGRESS
====================================================== */

export function uploadFileWithProgress(
    folder,
    fileName,
    file,
    onProgress,
    onComplete,
    onError
) {

    const storageRef = ref(
        storage,
        `${folder}/${fileName}`
    );

    const uploadTask = uploadBytesResumable(
        storageRef,
        file
    );

    uploadTask.on(

        "state_changed",

        (snapshot) => {

            const progress =
                (snapshot.bytesTransferred /
                snapshot.totalBytes) * 100;

            if (onProgress) {
                onProgress(progress);
            }

        },

        (error) => {

            if (onError) {
                onError(error);
            }

        },

        async () => {

            const url = await getDownloadURL(
                uploadTask.snapshot.ref
            );

            if (onComplete) {
                onComplete(url);
            }

        }

    );

}

/* ======================================================
   DELETE FILE
====================================================== */

export async function deleteFile(path) {

    try {

        const fileRef = ref(storage, path);

        await deleteObject(fileRef);

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false,
            message: error.message
        };

    }

}

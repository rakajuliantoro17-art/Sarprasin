// ======================================================
// Firestore Database Service
// Sarprasin v2.0
// ======================================================

import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "firebase/firestore";

import { db } from "./config.js";

/* ======================================================
   COLLECTION
====================================================== */

export const COLLECTION = {

    USERS: "users",

    MASTER: "master",

    ASSETS: "aset",

    HISTORY: "histori",

    LOG: "logAktivitas",

    SETTINGS: "settings",

    CACHE: "dashboardCache"

};

/* ======================================================
   GET ALL
====================================================== */

export async function getAll(collectionName) {

    const snapshot = await getDocs(collection(db, collectionName));

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}

/* ======================================================
   GET BY ID
====================================================== */

export async function getById(collectionName, id) {

    const snapshot = await getDoc(
        doc(db, collectionName, id)
    );

    if (!snapshot.exists()) return null;

    return {
        id: snapshot.id,
        ...snapshot.data()
    };

}

/* ======================================================
   CREATE
====================================================== */

export async function create(collectionName, data) {

    return await addDoc(
        collection(db, collectionName),
        {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    );

}

/* ======================================================
   CREATE WITH CUSTOM ID
====================================================== */

export async function createWithId(collectionName, id, data) {

    await setDoc(
        doc(db, collectionName, id),
        {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    );

}

/* ======================================================
   UPDATE
====================================================== */

export async function update(collectionName, id, data) {

    await updateDoc(
        doc(db, collectionName, id),
        {
            ...data,
            updatedAt: serverTimestamp()
        }
    );

}

/* ======================================================
   DELETE
====================================================== */

export async function remove(collectionName, id) {

    await deleteDoc(
        doc(db, collectionName, id)
    );

}

/* ======================================================
   QUERY
====================================================== */

export async function getWhere(
    collectionName,
    field,
    operator,
    value
) {

    const q = query(
        collection(db, collectionName),
        where(field, operator, value)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}

/* ======================================================
   ORDER
====================================================== */

export async function getOrdered(
    collectionName,
    field,
    direction = "asc"
) {

    const q = query(
        collection(db, collectionName),
        orderBy(field, direction)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}

/* ======================================================
   LIMIT
====================================================== */

export async function getLimited(
    collectionName,
    total
) {

    const q = query(
        collection(db, collectionName),
        limit(total)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}

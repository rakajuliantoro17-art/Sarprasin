/*
==========================================================

SARPRASIN
LOGIN PAGE CONTROLLER

Version : 2.1.0

==========================================================
*/

import { login } from "../../services/auth/auth.service.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");
const submitButton = form?.querySelector('button[type="submit"]');

function setMessage(text = "", type = "info") {

    if (!message) return;

    message.textContent = text;
    message.className = `login-message ${type}`;

}

function setLoading(isLoading) {

    if (!submitButton) return;

    submitButton.disabled = isLoading;

    submitButton.textContent = isLoading
        ? "Memproses..."
        : "Masuk";

}

async function handleLogin(event) {

    event.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    if (!email || !password) {

        setMessage(
            "Email dan password wajib diisi.",
            "warning"
        );

        return;

    }

    try {

        setLoading(true);

        setMessage(
            "Sedang masuk ke sistem...",
            "info"
        );

        /*
        ======================================================
        AuthService akan menangani:

        ✓ Firebase Authentication

        ✓ Ambil profile Firestore

        ✓ Ambil role

        ✓ Ambil permission

        ✓ Simpan ke auth.store

        ✓ Simpan ke user.store

        ✓ Redirect sesuai role

        ======================================================
        */

        await login(email, password);

    }

    catch (error) {

        console.error(error);

        setMessage(

            error?.message ||

            "Email atau password salah.",

            "error"

        );

    }

    finally {

        setLoading(false);

    }

}

if (form) {

    form.addEventListener(
        "submit",
        handleLogin
    );

}

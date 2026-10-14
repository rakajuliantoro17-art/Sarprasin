/*
==========================================================
SARPRASIN v2.0 - Halaman depan (portal)
File : src/assets/js/pages/landing.js

Menampilkan kartu portal. Kalau pengunjung sudah login,
tombol disesuaikan dengan role dan Firebase dimuat tanpa
menghambat tampilan awal.
==========================================================
*/

import { PORTALS, roleLabel, portalsForRole, defaultPath } from "../../../config/portals.js";

const grid = document.getElementById("portalGrid");

function cardHtml(key, { href, disabled, tag }) {
    const p = PORTALS[key];
    return `
        <a class="pt-card${disabled ? " disabled" : ""}" href="${href}">
            <span class="pt-icon">${p.icon}</span>
            <h3>${p.label}</h3>
            <p>${p.desc}</p>
            <small>Untuk: ${p.who}</small>
            <span class="pt-tag${p.roles ? "" : " open"}">${tag}</span>
        </a>`;
}

function renderGuest() {
    grid.innerHTML = Object.keys(PORTALS).map((key) => {
        const p = PORTALS[key];
        return p.roles
            ? cardHtml(key, { href: `/login?next=${encodeURIComponent(p.path)}`, tag: "Perlu login" })
            : cardHtml(key, { href: p.path, tag: "Tanpa login" });
    }).join("");
}

function renderMember(role, name) {
    const allowed = portalsForRole(role);

    grid.innerHTML = Object.keys(PORTALS).map((key) => {
        const p = PORTALS[key];
        if (!p.roles) return cardHtml(key, { href: p.path, tag: "Tanpa login" });
        return allowed.includes(key)
            ? cardHtml(key, { href: p.path, tag: "Akses Anda" })
            : cardHtml(key, { href: p.path, disabled: true, tag: "Tidak tersedia untuk akun ini" });
    }).join("");

    const home = defaultPath(role) || "/";
    const authBtn = document.getElementById("authBtn");
    authBtn.textContent = "Masuk ke Portal";
    authBtn.href = home;

    const hero = document.getElementById("heroBtn");
    hero.textContent = "Lanjut ke Portal Saya";
    hero.href = home;

    document.getElementById("portalHint").textContent =
        `Masuk sebagai ${name} (${roleLabel(role)}).`;
}

renderGuest();

// Cek sesi setelah tampilan awal muncul (Firebase cukup berat)
(async () => {
    try {
        const { authListener, getById, COLLECTION } =
            await import("../../../services/firebase/index.js");

        authListener(async (user) => {
            if (!user) return;
            const snap = await getById(COLLECTION.USERS, user.uid);
            if (!snap.exists()) return;
            const data = snap.data();
            renderMember(data.role, data.name || user.email);
        });
    } catch (error) {
        console.warn("Cek sesi dilewati:", error.message);
    }
})();

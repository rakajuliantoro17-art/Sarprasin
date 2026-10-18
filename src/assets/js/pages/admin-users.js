/*
==========================================================
SARPRASIN v2.0 - Manajemen Akun (khusus admin)
File : src/assets/js/pages/admin-users.js

Admin membuat akun login + profil (role, ruangan) langsung dari
sini lewat Cloud Function (functions/userAdmin.js), mengubah
role/status, mengganti password, mengirim email atur-ulang
password, dan menghapus akun.

Tombol "Daftarkan UID yang sudah ada" tetap tersedia untuk akun
yang dulu dibuat manual di Firebase Console.
==========================================================
*/

import {
    createWithId, update, getAll, callFunction, resetPassword, COLLECTION
} from "../../../services/firebase/index.js";
import {
    initAdminPage, setText, toRows, renderTable, escapeHtml
} from "../shared/admin-shell.js";
import { openFormModal, confirmDialog } from "../shared/form-modal.js";
import { loadRooms } from "../shared/inventory-data.js";
import { ROLE_LABEL, roleLabel } from "../../../config/portals.js";

const state = { users: [], rooms: [], q: "", roleFilter: "", me: null };

// Role yang memakai penugasan ruangan (sama dengan firestore.rules)
const ROOM_ROLES = ["operator", "guru", "wali_kelas", "viewer"];

const ROLE_OPTIONS = Object.keys(ROLE_LABEL).map((r) => ({ value: r, label: ROLE_LABEL[r] }));

initAdminPage({
    key: "users",
    title: "User Management",
    onReady: async ({ uid }) => {
        state.me = uid;
        await refresh();

        fillRoleFilter();

        document.getElementById("searchInput").addEventListener("input", (e) => {
            state.q = e.target.value.trim().toLowerCase();
            render();
        });
        document.getElementById("roleFilter").addEventListener("change", (e) => {
            state.roleFilter = e.target.value;
            render();
        });
        document.getElementById("addBtn").addEventListener("click", () => openCreateForm());
        document.getElementById("linkBtn").addEventListener("click", () => openLinkForm());

        document.getElementById("dataTable").addEventListener("click", onTableClick);
    }
});

/* ======================================================
   DATA
====================================================== */

async function refresh() {
    try {
        [state.users, state.rooms] = await Promise.all([
            getAll(COLLECTION.USERS).then(toRows),
            loadRooms()
        ]);
    } catch (error) {
        console.error("Gagal memuat data:", error);
        document.getElementById("dataTable").innerHTML =
            '<tr><td colspan="6" class="page-empty">Gagal memuat data (cek Firestore Rules).</td></tr>';
        return;
    }
    render();
}

function fillRoleFilter() {
    const select = document.getElementById("roleFilter");
    select.innerHTML = '<option value="">Semua role</option>' +
        ROLE_OPTIONS.map((o) => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join("");
}

function roomNames(codes = []) {
    return codes
        .map((k) => state.rooms.find((r) => r.kodeRuang === k)?.namaRuang || k)
        .join(", ") || "-";
}

/* ======================================================
   TABEL
====================================================== */

function render() {

    const rows = state.users
        .filter((u) => !state.roleFilter || u.role === state.roleFilter)
        .filter((u) => !state.q || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(state.q))
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "id"));

    renderTable("dataTable", rows, [
        { render: (u) => escapeHtml(u.name) + (u.id === state.me ? ' <small class="hint">(Anda)</small>' : "") },
        { render: (u) => escapeHtml(u.email) },
        { render: (u) => escapeHtml(roleLabel(u.role)) },
        { render: (u) => ROOM_ROLES.includes(u.role) ? escapeHtml(roomNames(u.ruangan)) : "-" },
        { render: statusChip },
        { render: actionButtons }
    ]);

    setText("rowCount", `${rows.length} dari ${state.users.length} user`);
}

function statusChip(u) {
    const off = u.status === "nonaktif";
    return `<span class="chip ${off ? "chip-off" : "chip-on"}">${off ? "Nonaktif" : "Aktif"}</span>`;
}

function actionButtons(u) {
    const id = escapeHtml(u.id);
    const self = u.id === state.me;
    return [
        `<button type="button" class="btn-mini" data-act="edit" data-id="${id}">Edit</button>`,
        `<button type="button" class="btn-mini" data-act="password" data-id="${id}">Password</button>`,
        `<button type="button" class="btn-mini" data-act="reset" data-id="${id}" title="Kirim email atur ulang password">Email reset</button>`,
        self ? "" : `<button type="button" class="btn-mini danger" data-act="delete" data-id="${id}">Hapus</button>`
    ].join("");
}

async function onTableClick(e) {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;

    const row = state.users.find((u) => u.id === btn.dataset.id);
    if (!row) return;

    btn.disabled = true;
    try {
        switch (btn.dataset.act) {
            case "edit": openEditForm(row); break;
            case "password": openPasswordForm(row); break;
            case "reset": await sendResetEmail(row); break;
            case "delete": await deleteAccount(row); break;
        }
    } catch (error) {
        console.error(error);
        window.alert(error?.message || "Aksi gagal.");
    } finally {
        btn.disabled = false;
    }
}

/* ======================================================
   BUAT AKUN BARU
====================================================== */

/** Password acak 12 karakter tanpa huruf/angka yang mudah tertukar. */
function randomPassword(length = 12) {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    return [...bytes].map((n) => alphabet[n % alphabet.length]).join("");
}

function roomField() {
    return {
        name: "ruangan",
        label: "Ruangan yang ditugaskan (hanya berlaku untuk Operator, Guru, Wali Kelas, Viewer)",
        type: "checks", full: true,
        options: state.rooms.map((r) => ({ value: r.kodeRuang, label: r.namaRuang }))
    };
}

function openCreateForm() {

    openFormModal({
        title: "Buat Akun Baru",
        submitText: "Buat Akun",
        values: { password: randomPassword() },
        fields: [
            { name: "name", label: "Nama lengkap (sama dengan Penanggung Jawab ruangan)", required: true, full: true },
            { name: "email", label: "Email (dipakai untuk login)", type: "email", required: true },
            { name: "role", label: "Role", type: "select", required: true, options: ROLE_OPTIONS },
            { name: "password", label: "Password awal (min. 8 karakter, sudah diisi acak - boleh diganti)", required: true, full: true },
            roomField()
        ],
        onSubmit: async (data) => {

            if (data.password.length < 8) throw new Error("Password minimal 8 karakter.");

            const created = await callFunction("createUserAccount", {
                name: data.name,
                email: data.email,
                role: data.role,
                password: data.password,
                ruangan: data.ruangan || []
            });

            await refresh();
            showCredentials({ title: "Akun berhasil dibuat", email: created.email, password: data.password });
        }
    });
}

/* ======================================================
   UBAH ROLE / STATUS / RUANGAN
====================================================== */

function openEditForm(row) {

    openFormModal({
        title: `Edit User - ${row.name || row.email}`,
        values: { ...row, status: row.status || "aktif" },
        fields: [
            { name: "name", label: "Nama", required: true, full: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "role", label: "Role", type: "select", required: true, options: ROLE_OPTIONS },
            { name: "status", label: "Status", type: "select", required: true,
              options: [{ value: "aktif", label: "Aktif" }, { value: "nonaktif", label: "Nonaktif (tidak bisa masuk)" }] },
            roomField()
        ],
        onSubmit: async (data) => {

            if (row.id === state.me && (data.role !== "admin" || data.status !== "aktif")) {
                throw new Error("Akun Anda sendiri harus tetap Admin dan Aktif.");
            }

            const ruangan = ROOM_ROLES.includes(data.role) ? (data.ruangan || []) : [];
            let fallback = false;

            try {
                await callFunction("updateUserAccount", {
                    uid: row.id, name: data.name, email: data.email,
                    role: data.role, status: data.status, ruangan
                });
            } catch (error) {
                if (!error.notDeployed) throw error;

                // Cloud Function belum aktif: tetap ubah profil di database
                // supaya halaman ini tidak mati total. Akun login (Auth) tidak ikut berubah.
                await update(COLLECTION.USERS, row.id, {
                    name: data.name, email: data.email, role: data.role,
                    status: data.status, ruangan, updatedAt: new Date().toISOString()
                });
                fallback = true;
            }

            await refresh();

            if (fallback) {
                window.alert(
                    "Cloud Function belum aktif, jadi hanya profil di database yang diubah " +
                    "(role, status, ruangan). Perubahan email/nonaktif pada akun login baru berlaku setelah Function di-deploy."
                );
            }
        }
    });
}

/* ======================================================
   PASSWORD
====================================================== */

function openPasswordForm(row) {

    openFormModal({
        title: `Ganti Password - ${row.name || row.email}`,
        submitText: "Ganti Password",
        values: { password: randomPassword() },
        fields: [
            { name: "password", label: "Password baru (min. 8 karakter, sudah diisi acak - boleh diganti)", required: true, full: true }
        ],
        onSubmit: async (data) => {

            if (data.password.length < 8) throw new Error("Password minimal 8 karakter.");

            await callFunction("setUserPassword", { uid: row.id, password: data.password });

            showCredentials({ title: "Password berhasil diganti", email: row.email, password: data.password });
        }
    });
}

async function sendResetEmail(row) {
    if (!confirmDialog(`Kirim email atur ulang password ke ${row.email}?`)) return;

    try {
        await resetPassword(row.email);
    } catch (error) {
        throw new Error(
            error?.code === "auth/user-not-found"
                ? "Akun login untuk email ini tidak ditemukan di Firebase Authentication."
                : "Gagal mengirim email atur ulang password."
        );
    }
    window.alert(`Email atur ulang password dikirim ke ${row.email}. Minta yang bersangkutan memeriksa kotak masuk dan folder spam.`);
}

/* ======================================================
   HAPUS
====================================================== */

async function deleteAccount(row) {
    if (!confirmDialog(
        `Hapus akun "${row.name || row.email}" (${row.email}) secara permanen?\n\n` +
        "Akun login dan profilnya akan dihapus dan tidak bisa dikembalikan."
    )) return;

    await callFunction("deleteUserAccount", { uid: row.id });
    await refresh();
}

/* ======================================================
   DAFTARKAN UID YANG SUDAH ADA (akun dari Firebase Console)
====================================================== */

function openLinkForm() {

    openFormModal({
        title: "Daftarkan UID yang sudah ada",
        values: { status: "aktif" },
        fields: [
            { name: "uid", label: "UID (dari Firebase Authentication)", required: true, full: true,
              placeholder: "tempel UID akun yang sudah dibuat di Firebase Console" },
            { name: "name", label: "Nama", required: true, full: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "role", label: "Role", type: "select", required: true, options: ROLE_OPTIONS },
            { name: "status", label: "Status", type: "select", required: true,
              options: [{ value: "aktif", label: "Aktif" }, { value: "nonaktif", label: "Nonaktif (tidak bisa masuk)" }] },
            roomField()
        ],
        onSubmit: async (data) => {

            const id = data.uid.trim();
            if (!id || id.includes("/")) throw new Error("UID tidak valid.");
            if (state.users.some((u) => u.id === id)) throw new Error("UID ini sudah terdaftar.");

            const stamp = new Date().toISOString();
            await createWithId(COLLECTION.USERS, id, {
                name: data.name,
                email: data.email,
                role: data.role,
                status: data.status,
                ruangan: ROOM_ROLES.includes(data.role) ? (data.ruangan || []) : [],
                createdAt: stamp,
                updatedAt: stamp
            });

            await refresh();
        }
    });
}

/* ======================================================
   KARTU KREDENSIAL (ditampilkan sekali)
====================================================== */

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

function showCredentials({ title, email, password }) {

    const loginUrl = `${location.origin}/login`;

    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
        <div class="modal-box glass cred-box" role="dialog" aria-modal="true">
            <div class="modal-head">
                <h3>${escapeHtml(title)}</h3>
                <button type="button" class="modal-close" aria-label="Tutup">✕</button>
            </div>
            <p class="hint">Catat atau salin sekarang. Password ini tidak akan ditampilkan lagi.
               Sampaikan langsung kepada yang bersangkutan dan sarankan menggantinya.</p>
            <dl class="cred-list">
                <dt>Alamat login</dt><dd>${escapeHtml(loginUrl)}</dd>
                <dt>Email</dt><dd>${escapeHtml(email)}</dd>
                <dt>Password</dt><dd><code>${escapeHtml(password)}</code></dd>
            </dl>
            <p class="form-error" hidden></p>
            <div class="modal-actions">
                <button type="button" class="btn-ghost" data-copy>Salin</button>
                <button type="button" class="btn-primary" data-close>Selesai</button>
            </div>
        </div>`;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector(".modal-close").addEventListener("click", close);
    overlay.querySelector("[data-close]").addEventListener("click", close);

    const copyBtn = overlay.querySelector("[data-copy]");
    copyBtn.addEventListener("click", async () => {
        const ok = await copyText(`Login SARPRASIN\nAlamat: ${loginUrl}\nEmail: ${email}\nPassword: ${password}`);
        copyBtn.textContent = ok ? "Tersalin ✓" : "Salin manual";
    });
}

/*
==========================================================
SARPRASIN v2.0 - User Management (khusus admin)
File : src/assets/js/pages/admin-users.js

Admin mendaftarkan profil user (role + ruangan yang ditugaskan).
Akun login (email & password) tetap dibuat di Firebase
Authentication; UID-nya ditempel di sini.
==========================================================
*/

import { createWithId, update, getAll, COLLECTION } from "../../../services/firebase/index.js";
import {
    initAdminPage, setText, toRows, renderTable, escapeHtml
} from "../shared/admin-shell.js";
import { openFormModal } from "../shared/form-modal.js";
import { loadRooms } from "../shared/inventory-data.js";
import { ROLE_LABEL, roleLabel } from "../../../config/portals.js";

const state = { users: [], rooms: [], q: "", me: null };

const USER_ROLES = ["operator", "guru", "wali_kelas", "viewer"];

initAdminPage({
    key: "users",
    title: "User Management",
    onReady: async ({ uid }) => {
        state.me = uid;
        await refresh();

        document.getElementById("searchInput").addEventListener("input", (e) => {
            state.q = e.target.value.trim().toLowerCase();
            render();
        });
        document.getElementById("addBtn").addEventListener("click", () => openForm());
        document.getElementById("dataTable").addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-id]");
            if (!btn) return;
            const row = state.users.find((u) => u.id === btn.dataset.id);
            if (row) openForm(row);
        });
    }
});

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

function roomNames(codes = []) {
    return codes
        .map((k) => state.rooms.find((r) => r.kodeRuang === k)?.namaRuang || k)
        .join(", ") || "-";
}

function render() {

    const rows = state.users
        .filter((u) => !state.q || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(state.q))
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "id"));

    renderTable("dataTable", rows, [
        { render: (u) => escapeHtml(u.name) },
        { render: (u) => escapeHtml(u.email) },
        { render: (u) => escapeHtml(roleLabel(u.role)) },
        { render: (u) => USER_ROLES.includes(u.role) ? escapeHtml(roomNames(u.ruangan)) : "-" },
        { render: (u) => escapeHtml(u.status || "aktif") },
        { render: (u) => `<button type="button" class="btn-mini" data-id="${escapeHtml(u.id)}">Edit</button>` }
    ]);

    setText("rowCount", `${rows.length} dari ${state.users.length} user`);
}

function openForm(row = null) {

    const editing = Boolean(row);

    const fields = [
        ...(editing ? [] : [{
            name: "uid", label: "UID (dari Firebase Authentication)", required: true, full: true,
            placeholder: "tempel UID akun yang sudah dibuat"
        }]),
        { name: "name", label: "Nama (sama dengan Penanggung Jawab ruangan)", required: true, full: true },
        { name: "email", label: "Email", required: true },
        { name: "role", label: "Role", type: "select", required: true,
          options: Object.keys(ROLE_LABEL).map((r) => ({ value: r, label: ROLE_LABEL[r] })) },
        { name: "status", label: "Status", type: "select", required: true,
          options: [{ value: "aktif", label: "Aktif" }, { value: "nonaktif", label: "Nonaktif (tidak bisa masuk)" }] },
        { name: "ruangan", label: "Ruangan yang ditugaskan (hanya berlaku untuk Operator, Guru, Wali Kelas, Viewer)",
          type: "checks", full: true,
          options: state.rooms.map((r) => ({ value: r.kodeRuang, label: r.namaRuang })) }
    ];

    openFormModal({
        title: editing ? `Edit User - ${row.name || row.email}` : "Tambah Profil User",
        values: editing ? { ...row, status: row.status || "aktif" } : { status: "aktif" },
        fields,
        onSubmit: async (data) => {

            const id = editing ? row.id : data.uid.trim();
            if (!id) throw new Error("UID wajib diisi.");

            if (id === state.me && (data.role !== "admin" || data.status !== "aktif")) {
                throw new Error("Akun Anda sendiri harus tetap Admin dan Aktif.");
            }

            const payload = {
                name: data.name,
                email: data.email,
                role: data.role,
                status: data.status,
                // ruangan hanya bermakna untuk role pengguna biasa
                ruangan: USER_ROLES.includes(data.role) ? (data.ruangan || []) : [],
                updatedAt: new Date().toISOString()
            };

            if (editing) {
                await update(COLLECTION.USERS, id, payload);
            } else {
                if (state.users.some((u) => u.id === id)) throw new Error("UID ini sudah terdaftar.");
                await createWithId(COLLECTION.USERS, id, { ...payload, createdAt: payload.updatedAt });
            }

            await refresh();
        }
    });
}

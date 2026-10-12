/*
==========================================================
SARPRASIN v2.0 - Halaman Admin: User Management
File : src/assets/js/pages/admin-users.js
==========================================================
*/

import { getAll, COLLECTION } from "../../../services/firebase/index.js";
import {
    initAdminPage, setText, toRows, renderTable, bindTableSearch, escapeHtml
} from "../shared/admin-shell.js";

const COLUMNS = [
    { render: (r) => escapeHtml(r.name) },
    { render: (r) => escapeHtml(r.email) },
    { render: (r) => escapeHtml(r.role) },
    { render: (r) => escapeHtml(r.status || "aktif") }
];

initAdminPage({
    key: "users",
    title: "User Management",
    onReady: async () => {
        try {
            const rows = toRows(await getAll(COLLECTION.USERS));
            renderTable("dataTable", rows, COLUMNS);
            setText("rowCount", rows.length + " data");
        } catch (error) {
            console.error("Gagal memuat data:", error);
            document.getElementById("dataTable").innerHTML =
                '<tr><td colspan="4" class="page-empty">Gagal memuat data (cek Firestore Rules).</td></tr>';
        }
        bindTableSearch("searchInput", "dataTable");
    }
});

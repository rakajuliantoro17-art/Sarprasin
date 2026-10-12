/*
==========================================================
SARPRASIN v2.0 - Halaman Admin: Ruangan
File : src/assets/js/pages/admin-ruangan.js
==========================================================
*/

import { getAll, COLLECTION } from "../../../services/firebase/index.js";
import {
    initAdminPage, setText, toRows, renderTable, bindTableSearch, escapeHtml
} from "../shared/admin-shell.js";

const COLUMNS = [
    { render: (r) => escapeHtml(r.kodeRuang || r.id) },
    { render: (r) => escapeHtml(r.namaRuang || r.nama) },
    { render: (r) => escapeHtml(r.jenis || r.tipe) },
    { render: (r) => escapeHtml(r.keterangan) }
];

initAdminPage({
    key: "ruangan",
    title: "Ruangan",
    onReady: async () => {
        try {
            const rows = toRows(await getAll(COLLECTION.ROOMS));
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

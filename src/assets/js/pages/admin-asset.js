/*
==========================================================
SARPRASIN v2.0 - Halaman Admin: Asset
File : src/assets/js/pages/admin-asset.js
==========================================================
*/

import { getAll, COLLECTION } from "../../../services/firebase/index.js";
import {
    initAdminPage, setText, toRows, renderTable, bindTableSearch, escapeHtml
} from "../shared/admin-shell.js";

const COLUMNS = [
    { render: (r) => escapeHtml(r.kodeBarang || r.id) },
    { render: (r) => escapeHtml(r.namaBarang) },
    { render: (r) => escapeHtml(r.kodeRuang) },
    { render: (r) => escapeHtml(r.kodeKondisi || r.kondisi) },
    { render: (r) => escapeHtml(r.tahun) },
    { render: (r) => r.nilai != null ? "Rp " + Number(r.nilai).toLocaleString("id-ID") : "-" }
];

initAdminPage({
    key: "asset",
    title: "Asset",
    onReady: async () => {
        try {
            const rows = toRows(await getAll(COLLECTION.ASSETS));
            renderTable("dataTable", rows, COLUMNS);
            setText("rowCount", rows.length + " data");
        } catch (error) {
            console.error("Gagal memuat data:", error);
            document.getElementById("dataTable").innerHTML =
                '<tr><td colspan="6" class="page-empty">Gagal memuat data (cek Firestore Rules).</td></tr>';
        }
        bindTableSearch("searchInput", "dataTable");
    }
});

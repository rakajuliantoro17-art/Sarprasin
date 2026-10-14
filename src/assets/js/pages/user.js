/*
==========================================================
SARPRASIN v2.0 - Portal Pengguna (guru, wali kelas, operator, viewer)
File : src/assets/js/pages/user.js

Tahap 1: lihat inventaris per ruangan + cetak KIR (read-only).
Tahap berikutnya: lapor kerusakan, input oleh ketua kelas.
==========================================================
*/

import { initPortalPage, escapeHtml } from "../shared/admin-shell.js";
import { loadRooms, loadAssets } from "../shared/inventory-data.js";
import { kirHtml } from "../shared/kir-sheet.js";

initPortalPage({
    portal: "user",
    key: "dashboard",
    title: "Inventaris Ruangan",
    onReady: async ({ name }) => {

        let rooms, assets;
        try {
            [rooms, assets] = await Promise.all([loadRooms(), loadAssets()]);
        } catch (error) {
            console.error(error);
            document.getElementById("kirSheet").innerHTML =
                '<p class="page-empty">Gagal memuat data (hubungi admin sarpras).</p>';
            return;
        }

        // ruangan yang penanggung jawabnya = nama user ditaruh paling atas
        const mine = (r) => (r.penanggungJawab || "").toLowerCase() === String(name).toLowerCase();
        rooms.sort((a, b) => Number(mine(b)) - Number(mine(a)));

        const select = document.getElementById("roomSelect");
        select.innerHTML = '<option value="">- pilih ruangan -</option>' +
            rooms.map((r) =>
                `<option value="${escapeHtml(r.kodeRuang)}">${mine(r) ? "★ " : ""}${escapeHtml(r.namaRuang)}</option>`
            ).join("");

        const render = () => {
            const room = rooms.find((r) => r.kodeRuang === select.value);
            document.getElementById("kirSheet").innerHTML = room
                ? kirHtml(room, assets)
                : '<p class="page-empty">Pilih ruangan untuk menampilkan kartu inventaris.</p>';
        };

        select.addEventListener("change", render);
        document.getElementById("printBtn").addEventListener("click", () => {
            if (!select.value) { alert("Pilih ruangan dulu."); return; }
            window.print();
        });

        if (rooms.length && mine(rooms[0])) { select.value = rooms[0].kodeRuang; }
        render();
    }
});

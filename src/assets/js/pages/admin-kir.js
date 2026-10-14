/*
==========================================================
SARPRASIN v2.0 - Kartu Inventaris Ruangan (KIR)
File : src/assets/js/pages/admin-kir.js

Pratinjau + cetak KIR per ruangan (A4 landscape).
Ringkasan kondisi: B = Baik, RR = Rusak Ringan, RB = Rusak Berat.
==========================================================
*/

import { initAdminPage, escapeHtml } from "../shared/admin-shell.js";
import { loadRooms, loadAssets } from "../shared/inventory-data.js";
import { kirHtml } from "../shared/kir-sheet.js";

const STORE_KEY = "sarprasin_kepsek";
const state = { rooms: [], assets: [] };

initAdminPage({
    key: "kir",
    activeKey: "ruangan",
    title: "KIR",
    onReady: async () => {

        try {
            [state.rooms, state.assets] = await Promise.all([loadRooms(), loadAssets()]);
        } catch (error) {
            console.error(error);
            document.getElementById("kirSheet").innerHTML =
                '<p class="page-empty">Gagal memuat data (cek Firestore Rules).</p>';
            return;
        }

        const select = document.getElementById("roomSelect");
        select.innerHTML = '<option value="">- pilih ruangan -</option>' +
            state.rooms.map((r) =>
                `<option value="${escapeHtml(r.kodeRuang)}">${escapeHtml(r.namaRuang)}</option>`
            ).join("");

        const initial = new URLSearchParams(location.search).get("ruang") || "";
        if (initial && state.rooms.some((r) => r.kodeRuang === initial)) select.value = initial;

        restoreKepsek();

        select.addEventListener("change", render);
        ["kepsekName", "kepsekNip"].forEach((id) =>
            document.getElementById(id).addEventListener("input", () => { saveKepsek(); render(); })
        );
        document.getElementById("printBtn").addEventListener("click", () => {
            if (!select.value) { alert("Pilih ruangan dulu."); return; }
            window.print();
        });

        render();
    }
});

function restoreKepsek() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
        document.getElementById("kepsekName").value = saved.name || "";
        document.getElementById("kepsekNip").value = saved.nip || "";
    } catch { /* abaikan */ }
}

function saveKepsek() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify({
            name: document.getElementById("kepsekName").value,
            nip: document.getElementById("kepsekNip").value
        }));
    } catch { /* abaikan */ }
}

function render() {

    const sheet = document.getElementById("kirSheet");
    const kode = document.getElementById("roomSelect").value;
    const room = state.rooms.find((r) => r.kodeRuang === kode);

    if (!room) {
        sheet.innerHTML = '<p class="page-empty">Pilih ruangan untuk menampilkan kartu inventaris.</p>';
        return;
    }

    sheet.innerHTML = kirHtml(room, state.assets, {
        kepsekName: document.getElementById("kepsekName").value.trim(),
        kepsekNip: document.getElementById("kepsekNip").value.trim()
    });
}

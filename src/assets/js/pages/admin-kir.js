/*
==========================================================
SARPRASIN v2.0 - Kartu Inventaris Ruangan (KIR)
File : src/assets/js/pages/admin-kir.js

Pratinjau + cetak KIR per ruangan (A4 landscape).
Ringkasan kondisi: B = Baik, RR = Rusak Ringan, RB = Rusak Berat.
==========================================================
*/

import { initAdminPage, escapeHtml } from "../shared/admin-shell.js";
import {
    SEKOLAH, JENIS_RUANG, labelOf, normalizeKondisi, loadRooms, loadAssets
} from "../shared/inventory-data.js";

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

    const items = state.assets
        .filter((a) => a.kodeRuang === kode)
        .sort((a, b) => String(a.kodeBarang || "").localeCompare(String(b.kodeBarang || ""), "id", { numeric: true }));

    const totals = { BAIK: 0, RUSAK_RINGAN: 0, RUSAK_BERAT: 0 };
    let totalQty = 0;

    const body = items.map((a, i) => {
        const k = normalizeKondisi(a.kodeKondisi || a.kondisi);
        const qty = Number(a.jumlah) || 1;
        totals[k] += qty;
        totalQty += qty;
        const mark = (code) => (k === code ? qty : "");
        return `
            <tr>
                <td class="c">${i + 1}</td>
                <td>${escapeHtml(a.namaBarang)}</td>
                <td>${escapeHtml(a.merk || "-")}</td>
                <td>${escapeHtml(a.kodeBarang || "-")}</td>
                <td class="c">${escapeHtml(a.tahun || "-")}</td>
                <td class="c">${qty}</td>
                <td class="c">${mark("BAIK")}</td>
                <td class="c">${mark("RUSAK_RINGAN")}</td>
                <td class="c">${mark("RUSAK_BERAT")}</td>
                <td>${escapeHtml(a.keterangan || "")}</td>
            </tr>`;
    }).join("") || `<tr><td colspan="10" class="c">Belum ada barang tercatat di ruangan ini.</td></tr>`;

    const kepsekName = document.getElementById("kepsekName").value.trim();
    const kepsekNip = document.getElementById("kepsekNip").value.trim();
    const tanggal = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    sheet.innerHTML = `
        <div class="kir-head">
            <img src="/logo/icon.png" alt="" class="kir-logo">
            <div class="kir-head-text">
                <div>${SEKOLAH.instansi1}</div>
                <div>${SEKOLAH.instansi2}</div>
                <strong>${SEKOLAH.nama}</strong>
                <div class="kir-addr">${SEKOLAH.alamat}</div>
            </div>
        </div>

        <h2 class="kir-title">KARTU INVENTARIS RUANGAN (KIR)</h2>

        <table class="kir-meta">
            <tr><td>Nama Ruang</td><td>: ${escapeHtml(room.namaRuang)}</td>
                <td>Kode Ruang</td><td>: ${escapeHtml(room.kodeRuang)}</td></tr>
            <tr><td>Jenis Ruang</td><td>: ${escapeHtml(labelOf(JENIS_RUANG, room.jenis))}</td>
                <td>Gedung / Lantai</td><td>: ${escapeHtml(room.gedungLantai || "-")}</td></tr>
            <tr><td>Luas / Kapasitas</td><td>: ${room.luas ? escapeHtml(room.luas) + " m²" : "-"} / ${room.kapasitas ? escapeHtml(room.kapasitas) + " orang" : "-"}</td>
                <td>Penanggung Jawab</td><td>: ${escapeHtml(room.penanggungJawab || "-")}</td></tr>
        </table>

        <table class="kir-table">
            <thead>
                <tr>
                    <th rowspan="2">No</th>
                    <th rowspan="2">Nama Barang</th>
                    <th rowspan="2">Merk / Model</th>
                    <th rowspan="2">Kode Barang</th>
                    <th rowspan="2">Tahun</th>
                    <th rowspan="2">Jml</th>
                    <th colspan="3">Kondisi</th>
                    <th rowspan="2">Keterangan</th>
                </tr>
                <tr><th>B</th><th>RR</th><th>RB</th></tr>
            </thead>
            <tbody>${body}</tbody>
            <tfoot>
                <tr>
                    <td colspan="5" class="r"><strong>Jumlah</strong></td>
                    <td class="c"><strong>${totalQty}</strong></td>
                    <td class="c"><strong>${totals.BAIK}</strong></td>
                    <td class="c"><strong>${totals.RUSAK_RINGAN}</strong></td>
                    <td class="c"><strong>${totals.RUSAK_BERAT}</strong></td>
                    <td></td>
                </tr>
            </tfoot>
        </table>

        <p class="kir-note">B = Baik, RR = Rusak Ringan, RB = Rusak Berat</p>

        <div class="kir-sign">
            <div>
                <p>Mengetahui,<br>Kepala Sekolah</p>
                <div class="kir-sign-space"></div>
                <p><strong><u>${escapeHtml(kepsekName || "..............................")}</u></strong><br>NIP. ${escapeHtml(kepsekNip || "..............................")}</p>
            </div>
            <div>
                <p>${SEKOLAH.kota}, ${tanggal}<br>Penanggung Jawab Ruang</p>
                <div class="kir-sign-space"></div>
                <p><strong><u>${escapeHtml(room.penanggungJawab || "..............................")}</u></strong></p>
            </div>
        </div>`;
}

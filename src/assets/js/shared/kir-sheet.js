/*
==========================================================
SARPRASIN v2.0
TEMPLATE KARTU INVENTARIS RUANGAN (KIR)
File : src/assets/js/shared/kir-sheet.js

Dipakai portal Admin (/admin/kir) dan portal Pengguna (/user).
Mengembalikan HTML kartu; styling ada di layout/shell.css (.kir-*).
==========================================================
*/

import { escapeHtml } from "./admin-shell.js";
import { SEKOLAH, JENIS_RUANG, labelOf, normalizeKondisi } from "./inventory-data.js";

export function kirHtml(room, assets, { kepsekName = "", kepsekNip = "" } = {}) {

    const items = assets
        .filter((a) => a.kodeRuang === room.kodeRuang)
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

    const tanggal = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    return `
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

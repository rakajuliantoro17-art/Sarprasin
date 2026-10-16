/*
==========================================================
SARPRASIN v2.0
DATA TETAP INVENTARIS (kondisi, sumber dana, jenis ruang)
File : src/assets/js/shared/inventory-data.js

Dibuat tetap di kode supaya form bisa dipakai tanpa harus
mengisi koleksi master di Firestore dulu.
==========================================================
*/

import { getAll, COLLECTION } from "../../../services/firebase/index.js";
import { toRows } from "./admin-shell.js";

/* Pilihan mengikuti spreadsheet sekolah:
   Baik / Perlu Perbaikan / Rusak Berat.
   Untuk KIR: Perlu Perbaikan = Rusak Ringan (RR). */
export const KONDISI = [
    { value: "BAIK",         label: "Baik",                          short: "B"  },
    { value: "RUSAK_RINGAN", label: "Perlu Perbaikan (Rusak Ringan)", short: "RR" },
    { value: "RUSAK_BERAT",  label: "Rusak Berat",                   short: "RB" }
];

/* Kode sumber dana dari spreadsheet (BOSP, BOSK, BPPOP) + cadangan.
   Mau menambah? Cukup tambah baris di sini. */
export const SUMBER_DANA = [
    { value: "BOSP",    label: "BOSP" },
    { value: "BOSK",    label: "BOSK" },
    { value: "BPPOP",   label: "BPPOP" },
    { value: "APBD",    label: "APBD" },
    { value: "APBN",    label: "APBN" },
    { value: "KOMITE",  label: "Komite / Sumbangan" },
    { value: "HIBAH",   label: "Hibah" },
    { value: "LAINNYA", label: "Lainnya" }
];

export const JENIS_RUANG = [
    { value: "KELAS",      label: "Ruang Kelas" },
    { value: "LAB",        label: "Laboratorium" },
    { value: "PERPUS",     label: "Perpustakaan" },
    { value: "KANTOR",     label: "Ruang Kantor / Guru" },
    { value: "OLAHRAGA",   label: "Sarana Olahraga" },
    { value: "IBADAH",     label: "Tempat Ibadah" },
    { value: "LAINNYA",    label: "Lainnya" }
];

export const SEKOLAH = {
    instansi1: "PEMERINTAH PROVINSI JAWA TIMUR",
    instansi2: "DINAS PENDIDIKAN",
    nama: "SMA NEGERI 1 SOOKO",
    alamat: "Kabupaten Mojokerto, Jawa Timur",
    kota: "Mojokerto"
};

export function labelOf(list, value) {
    return list.find((i) => i.value === value)?.label || value || "-";
}

/** Teks kondisi apa pun (spreadsheet lama / kode lama) -> kode baku */
export function normalizeKondisi(value) {
    const v = String(value || "").trim().toUpperCase().replace(/[\s-]+/g, "_");
    if (v === "BAIK" || v === "B") return "BAIK";
    if (["RUSAK_RINGAN", "RR", "PERBAIKAN", "PERLU_PERBAIKAN"].includes(v)) return "RUSAK_RINGAN";
    if (["RUSAK_BERAT", "RB", "RUSAK"].includes(v)) return "RUSAK_BERAT";
    return "BAIK";
}

export async function loadRooms() {
    const rows = toRows(await getAll(COLLECTION.ROOMS));
    return rows
        .map((r) => ({
            ...r,
            kodeRuang: r.kodeRuang || r.id,
            namaRuang: r.namaRuang || r.nama || r.id
        }))
        .sort((a, b) => a.namaRuang.localeCompare(b.namaRuang, "id", { numeric: true }));
}

export async function loadAssets() {
    return toRows(await getAll(COLLECTION.ASSETS));
}

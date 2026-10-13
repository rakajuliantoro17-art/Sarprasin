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

/* Standar KIR: B = Baik, RR = Rusak Ringan, RB = Rusak Berat */
export const KONDISI = [
    { value: "BAIK",         label: "Baik (B)",         short: "B"  },
    { value: "RUSAK_RINGAN", label: "Rusak Ringan (RR)", short: "RR" },
    { value: "RUSAK_BERAT",  label: "Rusak Berat (RB)",  short: "RB" }
];

export const SUMBER_DANA = [
    { value: "BOS",     label: "BOS" },
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

/** Kondisi lama (data awal) -> kode baku */
export function normalizeKondisi(value) {
    const v = String(value || "").toUpperCase();
    if (v === "BAIK" || v === "B") return "BAIK";
    if (v === "RUSAK_RINGAN" || v === "RR" || v === "PERBAIKAN") return "RUSAK_RINGAN";
    if (v === "RUSAK_BERAT" || v === "RB" || v === "RUSAK") return "RUSAK_BERAT";
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

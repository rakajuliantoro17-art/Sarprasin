/*
==========================================================
SARPRASIN v2.0 - Portal Publik (tanpa login)
File : src/assets/js/pages/public.js

Hanya membaca SATU dokumen agregat: publicSummary/latest
(diisi Waka Sarpras lewat tombol "Perbarui Ringkasan Publik").
Tidak ada data per barang / per orang yang terbuka.
==========================================================
*/

import { getById } from "../../../services/firebase/index.js";

const set = (id, v) => { document.getElementById(id).textContent = v; };

(async () => {
    try {
        const snap = await getById("publicSummary", "latest");

        if (!snap.exists()) {
            set("note", "Ringkasan publik belum dipublikasikan oleh pihak sekolah.");
            return;
        }

        const d = snap.data();
        const num = (n) => Number(n || 0).toLocaleString("id-ID");

        set("kBarang", num(d.totalBarang));
        set("kRuang", num(d.totalRuang));
        set("kBaik", num(d.baik));
        set("kRusak", num((d.rusakRingan || 0) + (d.rusakBerat || 0)));

        document.getElementById("barBaik").style.width = (d.persenBaik || 0) + "%";
        set("barLabel", `${d.persenBaik || 0}% barang dalam kondisi baik`);

        set("note", "Diperbarui: " + (d.updatedAt
            ? new Date(d.updatedAt).toLocaleString("id-ID") : "-"));

    } catch (error) {
        console.warn("Ringkasan publik tidak dapat dimuat:", error.message);
        set("note", "Ringkasan publik belum tersedia saat ini.");
    }
})();

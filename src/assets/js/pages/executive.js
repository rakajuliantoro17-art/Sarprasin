/*
==========================================================
SARPRASIN v2.0 - Portal Eksekutif (khusus Waka Sarpras)
File : src/assets/js/pages/executive.js
==========================================================
*/

import { createWithId } from "../../../services/firebase/index.js";
import { initPortalPage, setText, escapeHtml } from "../shared/admin-shell.js";
import { normalizeKondisi, loadRooms, loadAssets } from "../shared/inventory-data.js";

let summary = null;

initPortalPage({
    portal: "executive",
    key: "dashboard",
    title: "Ringkasan Eksekutif",
    onReady: async () => {

        setText("asOf", new Date().toLocaleDateString("id-ID", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        }));

        let rooms, assets;
        try {
            [rooms, assets] = await Promise.all([loadRooms(), loadAssets()]);
        } catch (error) {
            console.error(error);
            document.getElementById("roomTable").innerHTML =
                '<tr><td colspan="6" class="page-empty">Gagal memuat data (cek Firestore Rules).</td></tr>';
            return;
        }

        const perRoom = new Map(rooms.map((r) => [r.kodeRuang, { room: r, total: 0, B: 0, RR: 0, RB: 0 }]));
        const all = { total: 0, B: 0, RR: 0, RB: 0, nilai: 0 };

        assets.forEach((a) => {
            const qty = Number(a.jumlah) || 1;
            const k = { BAIK: "B", RUSAK_RINGAN: "RR", RUSAK_BERAT: "RB" }[normalizeKondisi(a.kodeKondisi || a.kondisi)];
            all.total += qty;
            all[k] += qty;
            all.nilai += (Number(a.nilai) || 0) * qty;
            const bucket = perRoom.get(a.kodeRuang);
            if (bucket) { bucket.total += qty; bucket[k] += qty; }
        });

        const persenBaik = all.total ? Math.round((all.B / all.total) * 100) : 0;

        setText("kpiBarang", all.total.toLocaleString("id-ID"));
        setText("kpiRuang", rooms.length);
        setText("kpiBaik", persenBaik + "%");
        setText("kpiNilai", "Rp " + all.nilai.toLocaleString("id-ID"));

        const rows = [...perRoom.values()];
        document.getElementById("roomTable").innerHTML = rows.length
            ? rows.map((r) => `
                <tr>
                    <td>${escapeHtml(r.room.namaRuang)}</td>
                    <td>${escapeHtml(r.room.penanggungJawab || "-")}</td>
                    <td>${r.total}</td><td>${r.B}</td><td>${r.RR}</td><td>${r.RB}</td>
                </tr>`).join("")
            : '<tr><td colspan="6" class="page-empty">Belum ada ruangan.</td></tr>';

        summary = {
            totalBarang: all.total,
            totalRuang: rooms.length,
            baik: all.B,
            rusakRingan: all.RR,
            rusakBerat: all.RB,
            persenBaik,
            updatedAt: new Date().toISOString()
        };

        document.getElementById("publishBtn").addEventListener("click", publish);
    }
});

async function publish() {
    const msg = document.getElementById("publishMsg");
    if (!summary) return;
    try {
        // hanya angka agregat; tidak ada data per barang / per orang
        await createWithId("publicSummary", "latest", summary);
        msg.textContent = "Ringkasan publik diperbarui: " + new Date().toLocaleString("id-ID");
    } catch (error) {
        console.error(error);
        msg.textContent = "Gagal memperbarui ringkasan publik: " + error.message;
    }
}

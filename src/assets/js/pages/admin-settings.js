/*
==========================================================
SARPRASIN v2.0 - Settings (khusus admin)
File : src/assets/js/pages/admin-settings.js

Termasuk impor data awal dari spreadsheet (seed-spreadsheet.json).
Tidak menimpa dokumen yang sudah ada.
==========================================================
*/

import {
    createWithId, getById, COLLECTION
} from "../../../services/firebase/index.js";
import { initAdminPage, setText } from "../shared/admin-shell.js";

initAdminPage({
    key: "settings",
    title: "Settings",
    onReady: async ({ name, role }) => {
        setText("setName", name);
        setText("setRole", role);
        setText("setStatus", navigator.onLine ? "Online" : "Offline");

        const seed = (await import("../../data/seed-spreadsheet.json")).default;
        setText("impBuildings", seed.buildings.length);
        setText("impRooms", seed.rooms.length);
        setText("impAssets", seed.assets.length);
        document.getElementById("importPanel").hidden = false;

        document.getElementById("importBtn").addEventListener("click", () => runImport(seed));
    }
});

async function runImport(seed) {

    const btn = document.getElementById("importBtn");
    const msg = document.getElementById("importMsg");

    if (!window.confirm(`Impor ${seed.buildings.length} bangunan, ${seed.rooms.length} ruangan dan ${seed.assets.length} barang sekarang?`)) return;

    btn.disabled = true;
    let added = 0;
    let skipped = 0;
    const now = new Date().toISOString();

    const put = async (collectionName, item) => {
        const { id, ...data } = item;
        const exists = (await getById(collectionName, id)).exists();
        if (exists) { skipped++; return; }
        await createWithId(collectionName, id, { ...data, createdAt: now, updatedAt: now });
        added++;
    };

    try {
        for (const b of seed.buildings) {
            msg.textContent = `Mengimpor ${b.namaBangunan}...`;
            await put(COLLECTION.BUILDINGS, b);
        }
        for (const room of seed.rooms) {
            msg.textContent = `Mengimpor ruangan ${room.namaRuang}...`;
            await put(COLLECTION.ROOMS, room);
        }
        for (const [i, asset] of seed.assets.entries()) {
            msg.textContent = `Mengimpor barang ${i + 1}/${seed.assets.length}...`;
            await put(COLLECTION.ASSETS, asset);
        }
        msg.textContent = `Selesai: ${added} data baru masuk, ${skipped} sudah ada (dilewati).`;
    } catch (error) {
        console.error(error);
        msg.textContent = `Berhenti di tengah jalan: ${error.message}. ${added} data sudah masuk. Cek Firestore Rules lalu ulangi (aman).`;
    } finally {
        btn.disabled = false;
    }
}

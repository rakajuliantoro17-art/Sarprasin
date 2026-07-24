/*
==========================================================
SARPRASIN v2.0
DASHBOARD ADMIN CONTROLLER
File : src/assets/js/pages/admin.js
==========================================================
*/

import {
    authListener,
    getById,
    getAll,
    COLLECTION
} from "../../../services/firebase/index.js";

import { getAssets } from "../../../services/core/asset.service.js";
import { getLogs } from "../../../services/core/log.service.js";
import { logout } from "../../../services/auth/auth.service.js";

const ALLOWED_ROLES = ["admin", "waka_sarpras", "staff", "arsiparis"];

export function initAdminDashboard() {

    // Halaman ini tidak lewat bootstrap.js, jadi cek sesi
    // Firebase-nya sendiri di sini.
    authListener(async (authUser) => {

        if (!authUser) {
            window.location.href = "/login";
            return;
        }

        const profileSnap = await getById(COLLECTION.USERS, authUser.uid);
        const role = profileSnap.exists() ? profileSnap.data().role : null;

        if (!ALLOWED_ROLES.includes(role)) {
            window.location.href = "/login";
            return;
        }

        const name = profileSnap.data().name || authUser.email;

        renderUserInfo(name, role);
        bindLogout();
        bindSidebarToggle();
        bindThemeToggle();
        renderDate();

        await Promise.all([
            renderAssetStats(),
            renderRoomStat(),
            renderMaintenanceStat(),
            renderReportStat(),
            renderActivityTable(),
            renderSystemStatus()
        ]);

    });

}

function renderUserInfo(name, role) {

    setText("sidebarUserName", name);
    setText("sidebarUserRole", role);
    setText("topbarUserName", name);
    setText("topbarUserRole", role);

}

function bindLogout() {

    const button = document.getElementById("logoutButton");
    if (button) button.addEventListener("click", logout);

}

function bindSidebarToggle() {

    const toggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

    if (toggle && sidebar) {
        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }

}

function bindThemeToggle() {

    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const saved = localStorage.getItem("sarprasin_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);

    toggle.addEventListener("click", () => {

        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("sarprasin_theme", next);

    });

}

function renderDate() {

    setText(
        "dashboardDate",
        new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    );

}

async function renderAssetStats() {

    try {

        const assets = await getAssets();

        setText("totalAsset", assets.length);

        const needAttention = assets.filter(
            (a) => a.kondisi === "PERBAIKAN" || a.kondisi === "RUSAK"
        ).length;

        setText("maintenanceBadge", needAttention);

    } catch (error) {

        console.error("Gagal ambil data aset:", error);
        setText("totalAsset", "-");

    }

}

async function renderRoomStat() {

    try {

        const snapshot = await getAll(COLLECTION.ROOMS);
        setText("totalRoom", snapshot.size);

    } catch (error) {

        console.error("Gagal ambil data ruang:", error);
        setText("totalRoom", "-");

    }

}

async function renderMaintenanceStat() {

    try {

        const snapshot = await getAll(COLLECTION.MAINTENANCE);
        setText("totalMaintenance", snapshot.size);

    } catch (error) {

        console.warn("Data maintenance belum tersedia:", error.message);
        setText("totalMaintenance", 0);

    }

}

function renderReportStat() {

    const AVAILABLE_REPORT_TYPES = 4; // inventaris, ruang, keuangan, eksekutif
    setText("totalReport", AVAILABLE_REPORT_TYPES);

}

async function renderActivityTable() {

    const table = document.getElementById("activityTable");
    if (!table) return;

    const tbody = table.querySelector("tbody") || table;

    try {

        const logs = await getLogs();

        if (!logs.length) {
            tbody.innerHTML = `<tr><td colspan="4">Belum ada aktivitas tercatat.</td></tr>`;
            return;
        }

        tbody.innerHTML = logs
            .slice(0, 10)
            .map((log) => `
                <tr>
                    <td>${log.action || "-"}</td>
                    <td>${log.description || "-"}</td>
                    <td>${log.email || "-"}</td>
                    <td>${formatTimestamp(log.timestamp)}</td>
                </tr>
            `)
            .join("");

    } catch (error) {

        console.error("Gagal ambil log aktivitas:", error);
        tbody.innerHTML = `<tr><td colspan="4">Gagal memuat aktivitas.</td></tr>`;

    }

}

async function renderSystemStatus() {

    setText(
        "systemStatus",
        navigator.onLine ? "Online" : "Offline"
    );

}

function formatTimestamp(timestamp) {

    if (!timestamp) return "-";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleString("id-ID");

}

function setText(id, value) {

    const el = document.getElementById(id);
    if (el) el.textContent = value;

}

initAdminDashboard();

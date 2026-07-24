/*
==========================================================
SARPRASIN v2.0
Vite Configuration
File : vite.config.js
Version : 1.0.0

Vite secara default cuma build index.html di root.
Config ini memberitahu Vite bahwa halaman-halaman lain
di src/pages/ juga harus ikut di-build sebagai entry
terpisah (multi-page app).
==========================================================
*/

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({

    build: {

        rollupOptions: {

            input: {

                main: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "src/pages/login/index.html"),
                admin: resolve(__dirname, "src/pages/admin/index.html")

                // user SEMENTARA masih dikeluarkan dari build:
                // - src/pages/user/index.html butuh "/api-config.js" (belum ada)
                // Tambahkan lagi ke sini setelah file itu dibuat.

            }

        }

    }

});

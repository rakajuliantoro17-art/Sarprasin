/*
==========================================================

SARPRASIN
Application Bootstrap

Version : 2.1.x
Author  : SMAN 1 Sooko Mojokerto

----------------------------------------------------------
Tanggung Jawab:
- Memulai aplikasi
- Menangani startup
- Menangani fatal startup error

Seluruh proses inisialisasi dilakukan oleh:
src/init/index.js

==========================================================
*/

import { initApplication } from "./init/index.js";

/**
 * Bootstrap SARPRASIN
 */
export async function bootstrap() {

    console.group("🚀 SARPRASIN Bootstrap");

    console.time("Application Startup");

    try {

        console.info("Starting application...");

        await initApplication();

        console.info("Application initialized successfully.");

        console.timeEnd("Application Startup");

        console.groupEnd();

        return true;

    } catch (error) {

        console.timeEnd("Application Startup");

        console.groupEnd();

        console.error(
            "❌ Fatal startup error:",
            error
        );

        // Future:
        // Logger.error(error);
        // ErrorService.handle(error);
        // ShowStartupErrorScreen(error);

        return false;

    }

}

/**
 * Auto Bootstrap
 *
 * Jika index.html menggunakan:
 *
 * <script type="module" src="/src/main.js"></script>
 *
 * maka main.js cukup memanggil bootstrap().
 */

/*
==========================================================
Sarprasin 2.0
Push Notification Service
File : src/services/notification/push.service.js
Version : 2.0.0
==========================================================
*/

class PushService {

    /* ==========================================
       CHECK SUPPORT
    ========================================== */

    isSupported() {

        return "Notification" in window;

    }

    /* ==========================================
       REQUEST PERMISSION
    ========================================== */

    async requestPermission() {

        if (!this.isSupported()) {

            throw new Error(
                "Browser tidak mendukung Notification API."
            );

        }

        return await Notification.requestPermission();

    }

    /* ==========================================
       GET PERMISSION
    ========================================== */

    permission() {

        if (!this.isSupported()) {

            return "unsupported";

        }

        return Notification.permission;

    }

    /* ==========================================
       SHOW LOCAL NOTIFICATION
    ========================================== */

    show({

        title = "Sarprasin",

        body = "",

        icon = "/assets/images/logo.png",

        badge = "/assets/images/logo.png",

        image = null,

        tag = "sarprasin",

        data = {},

        requireInteraction = false

    }) {

        if (Notification.permission !== "granted") {

            return null;

        }

        return new Notification(title, {

            body,

            icon,

            badge,

            image,

            tag,

            data,

            requireInteraction

        });

    }

    /* ==========================================
       CLOSE
    ========================================== */

    close(notification) {

        if (notification) {

            notification.close();

        }

    }

}
const pushService = new PushService();

export default pushService;

export {

    PushService

};

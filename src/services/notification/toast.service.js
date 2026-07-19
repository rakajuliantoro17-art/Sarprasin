/*
==========================================================
Sarprasin 2.0
Toast Notification Service
File : src/services/notification/toast.service.js
Version : 2.0.0
==========================================================
*/

class ToastService {

    constructor() {

        this.container = null;

        this.duration = 4000;

    }

    /* ==========================================
       INIT
    ========================================== */

    init() {

        if (this.container) {

            return;

        }

        this.container = document.createElement("div");

        this.container.id = "toast-container";

        this.container.style.position = "fixed";
        this.container.style.top = "20px";
        this.container.style.right = "20px";
        this.container.style.zIndex = "99999";
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        this.container.style.gap = "10px";

        document.body.appendChild(

            this.container

        );

    }

    /* ==========================================
       SHOW
    ========================================== */

    show({

        title = "",

        message = "",

        type = "info",

        duration = this.duration

    }) {

        this.init();

        const toast = document.createElement("div");

        toast.className = `toast toast-${type}`;

        toast.style.minWidth = "300px";
        toast.style.maxWidth = "420px";
        toast.style.padding = "14px 18px";
        toast.style.borderRadius = "10px";
        toast.style.background = "#ffffff";
        toast.style.boxShadow =
            "0 8px 24px rgba(0,0,0,.15)";
        toast.style.borderLeft =
            `5px solid ${this.color(type)}`;

        toast.style.fontFamily = "Inter,sans-serif";

        toast.innerHTML = `

            <strong>${title}</strong>

            <div style="margin-top:6px">

                ${message}

            </div>

        `;

        this.container.appendChild(

            toast

        );

        setTimeout(() => {

            toast.remove();

        }, duration);

    }

    /* ==========================================
       COLORS
    ========================================== */

    color(type) {

        switch (type) {

            case "success":

                return "#16a34a";

            case "warning":

                return "#f59e0b";

            case "error":

                return "#dc2626";

            default:

                return "#2563eb";

        }

    }

    /* ==========================================
       SHORTCUTS
    ========================================== */

    success(message, title = "Berhasil") {

        this.show({

            title,

            message,

            type: "success"

        });

    }

    error(message, title = "Terjadi Kesalahan") {

        this.show({

            title,

            message,

            type: "error"

        });

    }

    warning(message, title = "Peringatan") {

        this.show({

            title,

            message,

            type: "warning"

        });

    }

    info(message, title = "Informasi") {

        this.show({

            title,

            message,

            type: "info"

        });

    }

}

const toastService =

    new ToastService();

export default toastService;

export {

    ToastService

};

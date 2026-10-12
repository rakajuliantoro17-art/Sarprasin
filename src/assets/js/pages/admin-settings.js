import { initAdminPage, setText } from "../shared/admin-shell.js";

initAdminPage({
    key: "settings",
    title: "Settings",
    onReady: ({ name, role }) => {
        setText("setName", name);
        setText("setRole", role);
        setText("setStatus", navigator.onLine ? "Online" : "Offline");
    }
});

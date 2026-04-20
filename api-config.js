// ======================================
// GLOBAL API CONFIG - SARPRAS SYSTEM
// ======================================

const API_CONFIG = {
  BASE_URL: "https://script.google.com/macros/s/AKfycbyn6rNCuC7KgCfmvrphSqYfZ_pZ8q1Hk1gNQT3odSdVemLWeETdqahMI44KCBTi3pU6kg/exec",

  API_KEY: "SARPRAS123",

  ENDPOINTS: {
    submit: "",
    executive: "?action=executive",
    public: "?action=public"
  },

  TIMEOUT: 15000 // 15 detik
};


// ======================================
// UNIVERSAL API HANDLER (PRO VERSION)
// ======================================

async function apiRequest(endpoint = "", method = "GET", data = null) {

  const url = API_CONFIG.BASE_URL + endpoint;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json"
    },
    signal: controller.signal
  };

  // Inject API KEY otomatis
  if (method === "POST" && data) {
    options.body = JSON.stringify({
      key: API_CONFIG.API_KEY,
      ...data
    });
  }

  try {

    const response = await fetch(url, options);

    clearTimeout(timeout);

    // HTTP error handling
    if (!response.ok) {
      return {
        status: "error",
        message: `HTTP Error ${response.status}`
      };
    }

    const result = await response.json();

    // Validasi format response backend
    if (!result || typeof result !== "object") {
      return {
        status: "error",
        message: "Response tidak valid dari server"
      };
    }

    return result;

  } catch (err) {

    // Timeout
    if (err.name === "AbortError") {
      return {
        status: "error",
        message: "Server terlalu lama merespon (timeout)"
      };
    }

    return {
      status: "error",
      message: "Koneksi ke server gagal"
    };
  }
}

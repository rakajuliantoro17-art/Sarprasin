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
  }

};


// ======================================
// UNIVERSAL API HANDLER
// ======================================

async function apiRequest(endpoint = "", method = "GET", data = null) {

  const url = API_CONFIG.BASE_URL + endpoint;

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (method === "POST" && data) {
    options.body = JSON.stringify({
      key: API_CONFIG.API_KEY,
      ...data
    });
  }

  try {

    const res = await fetch(url, options);
    return await res.json();

  } catch (err) {

    return {
      status: "error",
      message: "Koneksi ke server gagal"
    };

  }
}

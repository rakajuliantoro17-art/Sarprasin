/* ========================================
   🚀 EJIES API SERVICE
======================================== */

/* =========================
   CONFIG
========================= */
const BASE_URL = "https://script.google.com/macros/s/AKfycbwQ91nYeiRja06EfLSuQk789XIy52g0TmD7dG6ETtV76dYajQP5eVx-49fz-T4GKX3-/exec";

/* =========================
   HELPER FETCH
========================= */
async function fetchJSON(url){

  const res = await fetch(url);

  if(!res.ok){
    throw new Error("HTTP ERROR: " + res.status);
  }

  return await res.json();
}

/* =========================
   GET DASHBOARD SUMMARY
========================= */
export async function getDashboard(){

  try{
    const data = await fetchJSON(`${BASE_URL}?mode=api`);

    return {
      total: Number(data.total) || 0,
      baik: Number(data.baik) || 0,
      perbaikan: Number(data.perbaikan) || 0,
      rusak: Number(data.rusak) || 0,
      list: data.list || []
    };

  }catch(err){
    console.error("API ERROR (getDashboard):", err);

    return {
      total: 0,
      baik: 0,
      perbaikan: 0,
      rusak: 0,
      list: []
    };
  }
}

/* =========================
   OPTIONAL: GET DETAIL DATA
========================= */
export async function getAssets(){

  try{
    const data = await fetchJSON(`${BASE_URL}?mode=api`);

    return data.list || [];

  }catch(err){
    console.error("API ERROR (getAssets):", err);
    return [];
  }
}

/* =========================
   OPTIONAL: SEND REPORT (MIT APP READY)
========================= */
export async function sendReport(payload){

  try{

    const res = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    return await res.json();

  }catch(err){
    console.error("API ERROR (sendReport):", err);

    return {
      success: false,
      message: "Gagal kirim data"
    };
  }
}

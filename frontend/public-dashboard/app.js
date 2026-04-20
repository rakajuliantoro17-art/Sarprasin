/* ========================================
   🚀 EJIES PUBLIC DASHBOARD - FINAL JS
======================================== */

/* =========================
   CONFIG
========================= */
const API_URL = "https://script.google.com/macros/s/AKfycbwQ91nYeiRja06EfLSuQk789XIy52g0TmD7dG6ETtV76dYajQP5eVx-49fz-T4GKX3-/exec?mode=api";
const REFRESH_INTERVAL = 30000; // 30 detik

/* =========================
   STATE
========================= */
let chartInstance = null;

/* =========================
   HELPER
========================= */
function safeNumber(val){
  return Number(val) || 0;
}

/* =========================
   UPDATE TIME
========================= */
function setUpdateTime(){
  const now = new Date();
  const el = document.getElementById("updateTime");
  if(el){
    el.innerText = "Update: " + now.toLocaleString("id-ID");
  }
}

/* =========================
   PROGRESS BAR
========================= */
function setProgress(p){

  const fill = document.getElementById("progressFill");
  const status = document.getElementById("statusText");

  if(!fill || !status) return;

  fill.style.width = p + "%";
  fill.innerText = p + "%";

  if(p <= 50){
    fill.style.background = "linear-gradient(90deg,#ff416c,#ff4b2b)";
    status.innerText = "Tidak Layak";
  }
  else if(p <= 75){
    fill.style.background = "linear-gradient(90deg,#ff9966,#ff5e62)";
    status.innerText = "Cukup Layak";
  }
  else{
    fill.style.background = "linear-gradient(90deg,#2193b0,#6dd5ed)";
    status.innerText = "Layak";
  }
}

/* =========================
   CHART RENDER
========================= */
function renderChart(baik, perbaikan, rusak){

  const canvas = document.getElementById("chart");
  if(!canvas) return;

  if(chartInstance){
    chartInstance.destroy();
  }

  chartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Baik", "Perbaikan", "Rusak"],
      datasets: [{
        data: [baik, perbaikan, rusak],
        backgroundColor: [
          "#34c759",
          "#ffcc00",
          "#ff3b30"
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

/* =========================
   LOAD DATA
========================= */
async function loadDashboard(){

  try{

    const res = await fetch(API_URL);

    if(!res.ok){
      throw new Error("HTTP error " + res.status);
    }

    const data = await res.json();

    const total = safeNumber(data.total);
    const baik = safeNumber(data.baik);
    const perbaikan = safeNumber(data.perbaikan);
    const rusak = safeNumber(data.rusak);

    /* KPI UPDATE */
    document.getElementById("total").innerText = total;
    document.getElementById("baik").innerText = baik;
    document.getElementById("perbaikan").innerText = perbaikan;
    document.getElementById("rusak").innerText = rusak;

    /* HITUNG INDEKS */
    let percentage = 0;

    if(total > 0){
      const score =
        (baik * 1) +
        (perbaikan * 0.6) +
        (rusak * 0.2);

      percentage = Math.round((score / total) * 100);
    }

    setProgress(percentage);

    /* CHART */
    renderChart(baik, perbaikan, rusak);

    /* TIME */
    setUpdateTime();

  }catch(err){

    console.error("ERROR LOAD DASHBOARD:", err);

    const status = document.getElementById("statusText");
    if(status){
      status.innerText = "Gagal memuat data";
    }
  }
}

/* =========================
   AUTO REFRESH
========================= */
function startAutoRefresh(){
  setInterval(loadDashboard, REFRESH_INTERVAL);
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {

  loadDashboard();       // first load
  startAutoRefresh();    // auto refresh

});

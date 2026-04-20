/* =========================
   CONFIG
========================= */
const API_URL = "https://script.google.com/macros/s/AKfycbwikvDGV2da9AT4ExyFHhcHRRixk5mUwcyn2VmR57OO1Q7pEGn5nRqEsUDO6Ftapl4Z/exec";

let allAssets = [];
let chartInstance = null;

/* ========================= */
function formatRupiah(angka){
  return "Rp " + (angka || 0).toLocaleString("id-ID");
}

function setStatus(text, isError=false){
  const el = document.getElementById("statusText");
  if(!el) return;

  el.innerText = text;
  el.style.background = isError ? "rgba(255,0,0,0.2)" : "rgba(0,255,100,0.2)";
}

/* ========================= */
async function loadDashboard(){

  setStatus("Loading...");

  try{
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("API RESPONSE:", data);

    const assets = data.assets || data.data || [];

    const baik = data.baik ?? countStatus(assets, "Baik");
    const perbaikan = data.perbaikan ?? countStatus(assets, "Perlu Perbaikan");
    const rusak = data.rusak ?? countStatus(assets, "Rusak");

    const total = data.total ?? assets.length;

    updateKPI({ total, baik, perbaikan, rusak });

    allAssets = assets.map(a => ({
      nama: a.nama || a.name || "-",
      lokasi: a.lokasi || a.location || "-",
      status: a.status || a.condition || "-",
      tahun: a.tahun || a.year || "-",
      nilai: a.nilai || a.value || 0
    }));

    renderPie(baik, perbaikan, rusak);
    renderTable(allAssets);

    setStatus("LIVE");

  }catch(err){
    console.error(err);
    setStatus("ERROR", true);
  }
}

/* ========================= */
function countStatus(data, status){
  return data.filter(d => (d.status || "").toLowerCase() === status.toLowerCase()).length;
}

/* ========================= */
function updateKPI(data){
  document.getElementById("total").innerText = data.total || 0;
  document.getElementById("baik").innerText = data.baik || 0;
  document.getElementById("perbaikan").innerText = data.perbaikan || 0;
  document.getElementById("rusak").innerText = data.rusak || 0;
}

/* ========================= */
function renderPie(baik, perbaikan, rusak){

  const ctx = document.getElementById("pieChart");
  if(!ctx) return;

  if(chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx,{
    type:'pie',
    data:{
      labels:['Baik','Perbaikan','Rusak'],
      datasets:[{
        data:[baik, perbaikan, rusak],
        backgroundColor:['#34c759','#ffcc00','#ff3b30']
      }]
    },
    options:{ responsive:true }
  });
}

/* ========================= */
function renderTable(data){

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if(data.length === 0){
    tbody.innerHTML = `<tr><td colspan="5">Tidak ada data</td></tr>`;
    return;
  }

  data.forEach(a=>{
    tbody.innerHTML += `
      <tr>
        <td>${a.nama}</td>
        <td>${a.lokasi}</td>
        <td>${a.status}</td>
        <td>${a.tahun}</td>
        <td>${formatRupiah(a.nilai)}</td>
      </tr>
    `;
  });
}

/* ========================= */
function setupSearch(){
  const input = document.getElementById("search");

  input.addEventListener("input", function(){

    const key = this.value.toLowerCase();

    const filtered = allAssets.filter(a =>
      a.nama.toLowerCase().includes(key) ||
      a.lokasi.toLowerCase().includes(key) ||
      a.status.toLowerCase().includes(key)
    );

    renderTable(filtered);
  });
}

/* ========================= */
setInterval(loadDashboard, 30000);

document.addEventListener("DOMContentLoaded", ()=>{
  loadDashboard();
  setupSearch();
});

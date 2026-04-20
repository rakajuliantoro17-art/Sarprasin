/* =======================================================
   KONFIGURASI
======================================================= */

const SPREADSHEET_ID = "1cxA1-pkhP772dI8pSVqWC0o8p-mPFsnLUEli5xZk8as";
const FOLDER_ID = "1Q4_VzWCPp0soMxbXlKY8L02ORuk7Hubk";


/* =======================================================
   LOAD WEB
======================================================= */

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Sistem Inventaris SMAN 1 Sooko")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/* =======================================================
   SIMPAN DATA ASET (VERSI EXECUTIVE READY)
======================================================= */

function simpanData(data) {

  if (!data) throw new Error("Data tidak terkirim.");
  if (!data.nama) throw new Error("Nama barang kosong.");
  if (!data.lokasi) throw new Error("Lokasi kosong.");
  if (!data.tahun) throw new Error("Tahun kosong.");

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const sheet = ensureSheetExists(ss, "Data Aset", [
    "ID",
    "Kode",
    "Nama Barang",
    "Lokasi",
    "Status",
    "Tahun",
    "Sumber Dana",
    "Nilai",
    "Foto",
    "Tanggal Input",
    "Update Terakhir"
  ]);

  const kodeAuto = generateKodeBarang(data.lokasi, data.tahun);
  const idUnik = Utilities.getUuid();
  const now = new Date();

  let fileUrl = "";

  if (data.foto) {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(data.foto.split(',')[1]),
      data.mimeType,
      kodeAuto + ".jpg"
    );

    const folder = DriveApp.getFolderById(FOLDER_ID);
    const file = folder.createFile(blob);
    fileUrl = file.getUrl();
  }

  // Standarisasi status
  const statusValid = ["Baik", "Perlu Perbaikan", "Rusak Berat"];
  const statusFinal = statusValid.includes(data.status)
    ? data.status
    : "Baik";

  sheet.appendRow([
    idUnik,
    kodeAuto,
    data.nama,
    data.lokasi,
    statusFinal,
    data.tahun,
    data.sumber || "",
    Number(data.nilai) || 0,
    fileUrl,
    now,
    now
  ]);

  updateMasterRuangan(data.lokasi);
  updateRekapInventaris();

  return "Data berhasil disimpan ✅";
}


/* =======================================================
   AUTO GENERATE KODE BARANG
======================================================= */

function generateKodeBarang(lokasi, tahun) {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const sheet = ensureSheetExists(ss, "Data Aset", [
    "ID","Kode","Nama Barang","Lokasi","Status",
    "Tahun","Sumber Dana","Nilai","Foto",
    "Tanggal Input","Update Terakhir"
  ]);

  const data = sheet.getDataRange().getValues();
  let count = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i][3] == lokasi && data[i][5] == tahun) {
      count++;
    }
  }

  const urut = ("000" + (count + 1)).slice(-3);

  const kodeRuang = lokasi
    .replace(/\s+/g, "")
    .replace(".", "")
    .substring(0,5)
    .toUpperCase();

  return kodeRuang + "-" + tahun + "-" + urut;
}


/* =======================================================
   MASTER RUANGAN OTOMATIS
======================================================= */

function updateMasterRuangan(namaRuang) {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const sheet = ensureSheetExists(ss, "Master Ruangan",
    ["Kode Ruang","Nama Ruang"]);

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] == namaRuang) return;
  }

  const kodeRuang = namaRuang
    .replace(/\s+/g, "")
    .replace(".", "")
    .substring(0,6)
    .toUpperCase();

  sheet.appendRow([kodeRuang, namaRuang]);
}


/* =======================================================
   REKAP INVENTARIS PER RUANG (SUDAH SESUAI STRUKTUR BARU)
======================================================= */

function updateRekapInventaris() {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheetAset = ss.getSheetByName("Data Aset");
  if (!sheetAset) return;

  const sheetRekap = ensureSheetExists(ss, "Data Inventaris",
    ["Nama Ruang","Jumlah Barang","Total Nilai"]);

  const data = sheetAset.getDataRange().getValues();
  let rekap = {};

  for (let i = 1; i < data.length; i++) {

    const ruang = data[i][3]; // Lokasi
    const nilai = Number(data[i][7]) || 0; // Nilai

    if (!rekap[ruang]) {
      rekap[ruang] = { jumlah: 0, total: 0 };
    }

    rekap[ruang].jumlah++;
    rekap[ruang].total += nilai;
  }

  sheetRekap.clearContents();
  sheetRekap.appendRow(["Nama Ruang","Jumlah Barang","Total Nilai"]);

  for (let ruang in rekap) {
    sheetRekap.appendRow([
      ruang,
      rekap[ruang].jumlah,
      rekap[ruang].total
    ]);
  }
}


/* =======================================================
   FUNCTION UNTUK DASHBOARD EXECUTIVE
======================================================= */

function getSarprasData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Data Aset");
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  data.shift(); // hapus header
  return data;
}


/* =======================================================
   GENERATE QR CODE LINK
======================================================= */

function generateQRCodeURL(text) {
  return "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=" 
         + encodeURIComponent(text);
}


/* =======================================================
   GENERATE KARTU INVENTARIS
======================================================= */

function generateKartuInventaris(ruang) {

  if (!ruang) throw new Error("Nama ruang tidak boleh kosong.");

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Data Inventaris");
  if (!sheet) return "Data Inventaris belum tersedia.";

  const data = sheet.getDataRange().getValues();

  let jumlah = 0;
  let total = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == ruang) {
      jumlah = data[i][1];
      total = data[i][2];
      break;
    }
  }

  const dashboardUrl = ScriptApp.getService().getUrl();
  const qrUrl = generateQRCodeURL(dashboardUrl + "?ruang=" + encodeURIComponent(ruang));

  const doc = DocumentApp.create("Kartu Inventaris - " + ruang);
  const body = doc.getBody();

  body.appendParagraph("KARTU INVENTARIS RUANGAN")
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);

  body.appendParagraph("Nama Ruang : " + ruang);
  body.appendParagraph("Jumlah Barang : " + jumlah);
  body.appendParagraph("Total Nilai Aset : Rp " + total.toLocaleString());

  body.appendImage(UrlFetchApp.fetch(qrUrl).getBlob());

  doc.saveAndClose();

  return doc.getUrl();
}


/* =======================================================
   UTIL - CEK / BUAT SHEET
======================================================= */

function ensureSheetExists(ss, name, header) {

  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(header);
    sheet.getRange(1,1,1,header.length).setFontWeight("bold");
  }

  return sheet;
}
const SPREADSHEET_ID = "1cxA1-pkhP772dI8pSVqWC0o8p-mPFsnLUEli5xZk8as";
const SHEET_NAME = "Data Aset";


function doGet() {

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EJIES - Dashboard Publik</title>

  <style>

  body{
    margin:0;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto;
    background: linear-gradient(160deg,#8E0E00,#1F1C18,#1e3c72);
    color:white;
  }

  .container{
    padding:20px 16px;
    max-width:500px;
    margin:auto;
  }

  .logo{
    text-align:center;
    margin-bottom:15px;
  }

  .logo img{
    width:90px;
    height:auto;
    filter: drop-shadow(0 6px 15px rgba(0,0,0,0.5));
  }

  .title{
    font-size:20px;
    font-weight:600;
    text-align:center;
    margin-top:8px;
  }

  .subtitle{
    font-size:13px;
    opacity:0.8;
    text-align:center;
    margin-top:4px;
    margin-bottom:20px;
  }

  .glass{
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(20px);
    border-radius:22px;
    padding:18px;
    margin-bottom:16px;
    box-shadow:0 12px 40px rgba(0,0,0,0.4);
  }

  .kpi-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:14px;
  }

  .kpi-card{
    background: rgba(255,255,255,0.15);
    border-radius:18px;
    padding:16px;
    text-align:center;
    transition:0.3s;
  }

  .kpi-card:hover{
    transform:scale(1.03);
  }

  .kpi-label{
    font-size:13px;
    opacity:0.85;
  }

  .kpi-value{
    font-size:22px;
    font-weight:600;
    margin-top:6px;
  }

  .progress-bar{
    width:100%;
    height:28px;
    background:rgba(255,255,255,0.25);
    border-radius:30px;
    overflow:hidden;
    margin-top:10px;
  }

  .progress-fill{
    height:100%;
    width:0%;
    text-align:center;
    line-height:28px;
    font-weight:bold;
    border-radius:30px;
    transition:1s ease;
  }

  .status{
    text-align:center;
    margin-top:10px;
    font-weight:600;
    font-size:14px;
  }

  .footer{
    text-align:center;
    margin-top:20px;
    font-size:12px;
    opacity:0.7;
  }

  </style>
  </head>

  <body>

  <div class="container">

    <div class="logo">
      <img src="https://sman1sooko.sch.id/media_library/images/397a98c4618261af0d970851901f2b5b.png">
    </div>

    <div class="title">Dashboard Publik EJIES</div>
    <div class="subtitle" id="updateTime"></div>

    <div class="glass">
      <div class="kpi-grid">

        <div class="kpi-card">
          <div class="kpi-label">Total Aset</div>
          <div class="kpi-value" id="total">0</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Kondisi Baik</div>
          <div class="kpi-value" id="baik">0</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Perlu Perbaikan</div>
          <div class="kpi-value" id="perbaikan">0</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Rusak Berat</div>
          <div class="kpi-value" id="rusak">0</div>
        </div>

      </div>
    </div>

    <div class="glass">
      <div style="font-size:15px;font-weight:600;">Indeks Kelayakan Sarpras</div>

      <div class="progress-bar">
        <div id="progressFill" class="progress-fill">0%</div>
      </div>

      <div id="statusText" class="status"></div>
    </div>

    <div class="footer">
      Transparansi Data Aset Sekolah
    </div>

  </div>


  <script>

  function setUpdateTime(){
    const now=new Date();
    document.getElementById("updateTime").innerHTML=
    "Update: "+now.toLocaleString();
  }

  function setProgress(p){
    const fill=document.getElementById("progressFill");
    const status=document.getElementById("statusText");

    fill.style.width=p+"%";
    fill.innerHTML=p+"%";

    if(p<=50){
      fill.style.background="linear-gradient(90deg,#ff416c,#ff4b2b)";
      status.innerHTML="Status: Tidak Layak";
    }else if(p<=75){
      fill.style.background="linear-gradient(90deg,#ff9966,#ff5e62)";
      status.innerHTML="Status: Cukup Layak";
    }else{
      fill.style.background="linear-gradient(90deg,#2193b0,#6dd5ed)";
      status.innerHTML="Status: Layak";
    }
  }

  google.script.run
  .withSuccessHandler(function(data){

    document.getElementById("total").innerHTML=data.total;
    document.getElementById("baik").innerHTML=data.baik;
    document.getElementById("perbaikan").innerHTML=data.perbaikan;
    document.getElementById("rusak").innerHTML=data.rusak;

    let percentage=0;

    if(data.total>0){
      const score =
        (data.baik * 1) +
        (data.perbaikan * 0.6) +
        (data.rusak * 0.2);

      percentage=Math.round((score/data.total)*100);
    }

    setProgress(percentage);

  })
  .getDashboardData();

  setUpdateTime();

  </script>

  </body>
  </html>
  `;

  return HtmlService.createHtmlOutput(html);
}


function getDashboardData() {

  const result = {
    total: 0,
    baik: 0,
    perbaikan: 0,
    rusak: 0
  };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return result;

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return result;

  const headers = data[0];
  const iStatus = headers.indexOf("Status");
  if (iStatus === -1) return result;

  for (let i = 1; i < data.length; i++) {

    const status = data[i][iStatus];
    if (!status) continue;

    result.total++;

    if (status === "Baik") result.baik++;
    else if (status === "Perlu Perbaikan") result.perbaikan++;
    else if (status === "Rusak Berat") result.rusak++;
  }

  return result;
}
/*************************************************
 EXECUTIVE DASHBOARD FINAL
 Sinkron dengan Sheet: Data Aset
**************************************************/

const SPREADSHEET_ID = "1cxA1-pkhP772dI8pSVqWC0o8p-mPFsnLUEli5xZk8as";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Executive Monitoring")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getExecutiveDashboard() {

  const ss = SpreadsheetApp.openById("1cxA1-pkhP772dI8pSVqWC0o8p-mPFsnLUEli5xZk8as");
  const sheet = ss.getSheetByName("Data Aset");

  if (!sheet) {
    return { success:false, message:"Sheet Data Aset tidak ditemukan" };
  }

  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return { success:false, message:"Belum ada data aset" };
  }

  const headers = data.shift();

  const iKode = headers.indexOf("Kode");
const iKodeBarang = headers.indexOf("Kode Barang");
const iNama = headers.indexOf("Nama Barang");
const iLokasi = headers.indexOf("Lokasi");
const iStatus = headers.indexOf("Status");
const iTahun = headers.indexOf("Tahun");
const iSumberDana = headers.indexOf("Sumber Dana");
const iNilai = headers.indexOf("Nilai");
const iFoto = headers.indexOf("Foto");

  let total = 0;
  let baik = 0;
  let perbaikan = 0;
  let rusak = 0;
  let totalNilai = 0;
  let lokasiSet = new Set();
  let assets = [];

  data.forEach(row => {

    const nama = row[iNama];
    if (!nama) return; // skip baris kosong

    const status = row[iStatus];
    const nilai = Number(row[iNilai]) || 0;

    total++;
    totalNilai += nilai;
    lokasiSet.add(row[iLokasi]);

    if (status === "Baik") baik++;
    else if (status === "Perlu Perbaikan") perbaikan++;
    else if (status === "Rusak Berat") rusak++;

    assets.push({
      kode: row[iKode],
      kodeBarang: row[iKodeBarang],
      nama,
      lokasi: row[iLokasi],
      status,
      tahun: row[iTahun],
      sumberDana: row[iSumberDana],
      nilai,
      foto: row[iFoto]
    });
  });

  return {
    success:true,
    total,
    baik,
    perbaikan,
    rusak,
    totalNilai,
    lokasiList:Array.from(lokasiSet),
    assets
  };
}
function doGet(e) {
  return handleGet(e);
}

function doPost(e) {
  return handlePost(e);
}

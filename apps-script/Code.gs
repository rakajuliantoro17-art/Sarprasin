/* ========================================
   🚀 EJIES BACKEND FINAL
======================================== */

const SPREADSHEET_ID = "1cxA1-pkhP772dI8pSVqWC0o8p-mPFsnLUEli5xZk8as";
const FOLDER_ID = "1Q4_VzWCPp0soMxbXlKY8L02ORuk7Hubk";

/* =========================
   ROUTER
========================= */
function doGet(e){

  const mode = e.parameter.mode;

  if(mode === "api"){
    return ContentService
      .createTextOutput(JSON.stringify(getDashboard()))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // default: web preview
  return HtmlService.createHtmlOutput("EJIES API RUNNING 🚀");
}

function doPost(e){

  const data = JSON.parse(e.postData.contents);

  const result = simpanData(data);

  return ContentService
    .createTextOutput(JSON.stringify({
      success:true,
      message: result
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* =========================
   DASHBOARD API
========================= */
function getDashboard(){

  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("Data Aset");

  const result = {
    total:0,
    baik:0,
    perbaikan:0,
    rusak:0,
    list:[]
  };

  if(!sheet) return result;

  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const iNama = headers.indexOf("Nama Barang");
  const iLokasi = headers.indexOf("Lokasi");
  const iStatus = headers.indexOf("Status");
  const iNilai = headers.indexOf("Nilai");

  data.forEach(row => {

    const status = row[iStatus];
    if(!status) return;

    result.total++;

    if(status === "Baik") result.baik++;
    else if(status === "Perlu Perbaikan") result.perbaikan++;
    else if(status === "Rusak Berat") result.rusak++;

    result.list.push({
      nama: row[iNama],
      lokasi: row[iLokasi],
      status,
      nilai: row[iNilai]
    });

  });

  return result;
}

/* =========================
   SIMPAN DATA (MIT APP READY)
========================= */
function simpanData(data){

  if (!data.nama) throw new Error("Nama kosong");
  if (!data.lokasi) throw new Error("Lokasi kosong");

  const sheet = getSheet("Data Aset", [
    "ID","Kode","Nama Barang","Lokasi","Status",
    "Tahun","Sumber Dana","Nilai","Foto",
    "Tanggal Input"
  ]);

  const kode = "AST-" + new Date().getTime();
  const now = new Date();

  let fileUrl = "";

  if (data.foto && data.foto.startsWith("data:")) {

    const blob = Utilities.newBlob(
      Utilities.base64Decode(data.foto.split(',')[1]),
      data.mimeType,
      kode + ".jpg"
    );

    const folder = DriveApp.getFolderById(FOLDER_ID);
    const file = folder.createFile(blob);
    fileUrl = file.getUrl();
  }

  sheet.appendRow([
    Utilities.getUuid(),
    kode,
    data.nama,
    data.lokasi,
    data.status || "Baik",
    data.tahun || "",
    data.sumber || "",
    Number(data.nilai) || 0,
    fileUrl,
    now
  ]);

  return "Berhasil disimpan";
}

/* =========================
   HELPER
========================= */
function getSheet(name, headers){

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(name);

  if(!sheet){
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }

  return sheet;
}

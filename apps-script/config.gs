// ================= GLOBAL CONFIG =================

// Spreadsheet utama
const CONFIG = {
  SPREADSHEET_ID: "1cxA1-pkhP772dI8pSVqWC0o8p-mPFsnLUEli5xZk8as",

  // Nama sheet
  SHEETS: {
    DATA_ASET: "Data Aset",
    MASTER_RUANGAN: "Master Ruangan",
    REKAP: "Data Inventaris"
  },

  // Header standar
  HEADERS: {
    DATA_ASET: [
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
    ],

    MASTER_RUANGAN: [
      "Kode Ruang",
      "Nama Ruang"
    ],

    REKAP: [
      "Nama Ruang",
      "Jumlah Barang",
      "Total Nilai"
    ]
  },

  // Status default
  STATUS: {
    BAIK: "Baik",
    PERBAIKAN: "Perlu Perbaikan",
    RUSAK: "Rusak Berat"
  }
};


// ================= GET SPREADSHEET =================
function getSpreadsheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}


// ================= GET SHEET =================
function getSheet(sheetName, headers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
    }
  }

  return sheet;
}


// ================= AUTO INIT =================
function initDatabase() {
  // Data Aset
  getSheet(
    CONFIG.SHEETS.DATA_ASET,
    CONFIG.HEADERS.DATA_ASET
  );

  // Master Ruangan
  getSheet(
    CONFIG.SHEETS.MASTER_RUANGAN,
    CONFIG.HEADERS.MASTER_RUANGAN
  );

  // Rekap
  getSheet(
    CONFIG.SHEETS.REKAP,
    CONFIG.HEADERS.REKAP
  );

  Logger.log("Database siap digunakan");
}


// ================= UTIL ID =================
function generateId() {
  return Utilities.getUuid();
}


// ================= UTIL WAKTU =================
function now() {
  return new Date();
}

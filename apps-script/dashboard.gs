// ================= PUBLIC DASHBOARD =================
function getPublicData() {
  const data = getSarprasData();

  let total = data.length;
  let baik = 0;
  let perbaikan = 0;
  let rusak = 0;

  data.forEach(item => {
    const status = (item["Status"] || "").toLowerCase();

    if (status.includes("baik")) baik++;
    else if (status.includes("perbaikan")) perbaikan++;
    else if (status.includes("rusak")) rusak++;
  });

  return {
    status: "success",
    total_aset: total,
    kondisi: {
      baik,
      perbaikan,
      rusak
    }
  };
}


// ================= EXECUTIVE DASHBOARD =================
function getExecutiveData() {
  const data = getSarprasData();

  let totalNilai = 0;
  let lokasiMap = {};
  let statusMap = {};
  let yearlyMap = {};

  data.forEach(item => {
    const lokasi = item["Lokasi"] || "Tidak diketahui";
    const status = item["Status"] || "Tidak diketahui";
    const tahun = item["Tahun"] || "Unknown";
    const nilai = Number(item["Nilai"]) || 0;

    // Total nilai
    totalNilai += nilai;

    // Per lokasi
    lokasiMap[lokasi] = (lokasiMap[lokasi] || 0) + 1;

    // Per status
    statusMap[status] = (statusMap[status] || 0) + 1;

    // Per tahun
    yearlyMap[tahun] = (yearlyMap[tahun] || 0) + 1;
  });

  return {
    status: "success",
    total_aset: data.length,
    total_nilai: totalNilai,
    aset_per_lokasi: lokasiMap,
    kondisi: statusMap,
    distribusi_tahun: yearlyMap
  };
}


// ================= REKAP OTOMATIS =================
function generateRekap() {
  const data = getSarprasData();
  const sheet = getSheet(
    CONFIG.SHEETS.REKAP,
    CONFIG.HEADERS.REKAP
  );

  // Reset isi lama
  sheet.clear();
  sheet.appendRow(CONFIG.HEADERS.REKAP);

  let map = {};

  data.forEach(item => {
    const ruang = item["Lokasi"] || "Tidak diketahui";
    const nilai = Number(item["Nilai"]) || 0;

    if (!map[ruang]) {
      map[ruang] = {
        jumlah: 0,
        total: 0
      };
    }

    map[ruang].jumlah += 1;
    map[ruang].total += nilai;
  });

  // Masukkan ke sheet
  Object.keys(map).forEach(ruang => {
    sheet.appendRow([
      ruang,
      map[ruang].jumlah,
      map[ruang].total
    ]);
  });

  return "Rekap berhasil diperbarui";
}


// ================= TOP LOKASI =================
function getTopLokasi(limit = 5) {
  const data = getSarprasData();
  let map = {};

  data.forEach(item => {
    const lokasi = item["Lokasi"] || "Tidak diketahui";
    map[lokasi] = (map[lokasi] || 0) + 1;
  });

  const sorted = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return sorted.map(item => ({
    lokasi: item[0],
    jumlah: item[1]
  }));
}


// ================= TREND TAHUN =================
function getTrendTahun() {
  const data = getSarprasData();
  let map = {};

  data.forEach(item => {
    const tahun = item["Tahun"] || "Unknown";
    map[tahun] = (map[tahun] || 0) + 1;
  });

  return map;
}

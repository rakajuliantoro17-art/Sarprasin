// ================= API ROUTER =================

// Entry GET
function handleGet(e) {
  const mode = e.parameter.mode;

  try {

    // ===== PUBLIC DASHBOARD =====
    if (mode === "public") {
      return jsonOutput(getPublicData());
    }

    // ===== EXECUTIVE DASHBOARD =====
    if (mode === "executive") {
      return jsonOutput(getExecutiveData());
    }

    // ===== GET ALL DATA =====
    if (mode === "all") {
      return jsonOutput({
        status: "success",
        data: getSarprasData()
      });
    }

    // ===== DEFAULT =====
    return jsonOutput({
      status: "active",
      message: "API Sarpras aktif"
    });

  } catch (err) {
    return jsonOutput({
      status: "error",
      message: err.message
    });
  }
}


// Entry POST
function handlePost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    // ===== SIMPAN DATA =====
    const result = simpanData(payload);

    return jsonOutput({
      status: "success",
      message: result
    });

  } catch (err) {
    return jsonOutput({
      status: "error",
      message: err.message
    });
  }
}


// ================= HELPER =================

// Format JSON response
function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


// ================= DATA ACCESS =================

// Ambil semua data aset
function getSarprasData() {
  const sheet = getSheet("Data Aset", []);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
}
// CREATE
if (payload.action === "create") {
  return jsonOutput(simpanData(payload));
}

// UPDATE
if (payload.action === "update") {
  return jsonOutput({
    message: updateData(payload)
  });
}

// DELETE
if (payload.action === "delete") {
  return jsonOutput({
    message: deleteData(payload.id)
  });
}

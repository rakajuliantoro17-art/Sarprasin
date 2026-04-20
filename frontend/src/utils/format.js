/* ========================================
   🚀 EJIES FORMAT UTIL
======================================== */

/* =========================
   FORMAT NUMBER (1,000)
========================= */
export function formatNumber(value){

  if (value === null || value === undefined) return "0";

  return Number(value).toLocaleString("id-ID");
}

/* =========================
   FORMAT PERCENT (80%)
========================= */
export function formatPercent(value){

  if (value === null || value === undefined) return "0%";

  return `${Math.round(value)}%`;
}

/* =========================
   FORMAT DATE (DD MMM YYYY)
========================= */
export function formatDate(date){

  if (!date) return "-";

  try{
    const d = new Date(date);

    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  }catch{
    return date;
  }
}

/* =========================
   FORMAT DATETIME
========================= */
export function formatDateTime(date){

  if (!date) return "-";

  try{
    const d = new Date(date);

    return d.toLocaleString("id-ID");

  }catch{
    return date;
  }
}

/* =========================
   NORMALIZE STATUS
========================= */
export function normalizeStatus(status){

  if (!status) return "Tidak diketahui";

  const s = status.toLowerCase();

  if (s.includes("baik")) return "Baik";
  if (s.includes("perbaikan")) return "Perbaikan";
  if (s.includes("rusak")) return "Rusak";

  return status;
}

/* =========================
   STATUS CLASS (CSS)
========================= */
export function getStatusClass(status){

  if (!status) return "";

  const s = status.toLowerCase();

  if (s.includes("baik")) return "status-baik";
  if (s.includes("perbaikan")) return "status-perbaikan";
  if (s.includes("rusak")) return "status-rusak";

  return "";
}

/* =========================
   SAFE TEXT (ANTI NULL)
========================= */
export function safeText(text){

  if (text === null || text === undefined || text === "") {
    return "-";
  }

  return text;
}

/* =========================
   CAPITALIZE
========================= */
export function capitalize(text){

  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

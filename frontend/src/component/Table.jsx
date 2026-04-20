import { useState } from "react";

export default function Table({ data = [] }) {

  const [search, setSearch] = useState("");

  // filter sederhana
  const filteredData = data.filter(item =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (!status) return "#ccc";

    const s = status.toLowerCase();

    if (s.includes("baik")) return "#34c759";
    if (s.includes("perbaikan")) return "#ffcc00";
    if (s.includes("rusak")) return "#ff3b30";

    return "#ccc";
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      padding: "16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
    }}>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari data..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: "none",
          marginBottom: "12px",
          outline: "none"
        }}
      />

      {/* TABLE */}
      <div style={{
        overflowX: "auto"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white"
        }}>

          <thead>
            <tr style={{
              textAlign: "left",
              fontSize: "13px",
              opacity: 0.8
            }}>
              <th style={thStyle}>Kode</th>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>Lokasi</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Tahun</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                  Tidak ada data
                </td>
              </tr>
            )}

            {filteredData.map((item, index) => (
              <tr key={index} style={{
                borderTop: "1px solid rgba(255,255,255,0.1)"
              }}>

                <td style={tdStyle}>{item.kode}</td>
                <td style={tdStyle}>{item.nama}</td>
                <td style={tdStyle}>{item.lokasi}</td>

                <td style={{
                  ...tdStyle,
                  color: getStatusColor(item.status),
                  fontWeight: "600"
                }}>
                  {item.status}
                </td>

                <td style={tdStyle}>{item.tahun}</td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

/* STYLE */
const thStyle = {
  padding: "10px",
};

const tdStyle = {
  padding: "10px",
  fontSize: "14px"
};

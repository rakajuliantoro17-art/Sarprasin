export default function KPI({ label, value, type }) {

  // warna dinamis berdasarkan tipe
  const getColor = () => {
    switch(type){
      case "baik":
        return "linear-gradient(135deg,#34c759,#30d158)";
      case "perbaikan":
        return "linear-gradient(135deg,#ffcc00,#ff9500)";
      case "rusak":
        return "linear-gradient(135deg,#ff3b30,#ff453a)";
      default:
        return "linear-gradient(135deg,#5ac8fa,#007aff)";
    }
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(20px)",
      borderRadius: "18px",
      padding: "16px",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      transition: "0.3s",
    }}
    onMouseEnter={(e)=> e.currentTarget.style.transform="scale(1.05)"}
    onMouseLeave={(e)=> e.currentTarget.style.transform="scale(1)"}
    >

      <div style={{
        fontSize: "13px",
        opacity: 0.8
      }}>
        {label}
      </div>

      <div style={{
        fontSize: "26px",
        fontWeight: "600",
        marginTop: "6px",
        background: getColor(),
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        {value}
      </div>

    </div>
  );
}

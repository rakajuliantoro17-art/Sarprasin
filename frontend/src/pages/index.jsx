export default function Home(){

  return (
    <div style={styles.page}>

      {/* LOGO */}
      <div style={styles.logo}>
        <img src="https://sman1sooko.sch.id/media_library/images/397a98c4618261af0d970851901f2b5b.png" />
      </div>

      {/* TITLE */}
      <h1 style={styles.title}>EJIES</h1>
      <p style={styles.subtitle}>
        E-System Inventory Sarpras  
        <br/>
        SMAN 1 Sooko Mojokerto
      </p>

      {/* MENU */}
      <div style={styles.menu}>

        <a href="/executive" style={styles.card}>
          <h3>📊 Executive Dashboard</h3>
          <p>Monitoring internal sarpras</p>
        </a>

        <a href="/public-dashboard" style={styles.card}>
          <h3>🌍 Dashboard Publik</h3>
          <p>Transparansi data aset sekolah</p>
        </a>

        <a href="#" style={styles.card}>
          <h3>📱 Input Laporan</h3>
          <p>Melalui aplikasi siswa/guru</p>
        </a>

      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        © 2026 SMAN 1 Sooko
      </div>

    </div>
  );
}

/* =========================
   STYLE
========================= */
const styles = {

  page:{
    minHeight:"100vh",
    background:"linear-gradient(160deg,#8E0E00,#1F1C18,#1e3c72)",
    color:"white",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    padding:"20px"
  },

  logo:{
    marginBottom:"16px"
  },

  title:{
    fontSize:"32px",
    fontWeight:"700",
    marginBottom:"6px"
  },

  subtitle:{
    textAlign:"center",
    opacity:0.8,
    marginBottom:"30px",
    lineHeight:"1.5"
  },

  menu:{
    display:"grid",
    gridTemplateColumns:"1fr",
    gap:"14px",
    width:"100%",
    maxWidth:"400px"
  },

  card:{
    background:"rgba(255,255,255,0.12)",
    backdropFilter:"blur(20px)",
    borderRadius:"20px",
    padding:"18px",
    textDecoration:"none",
    color:"white",
    boxShadow:"0 10px 30px rgba(0,0,0,0.3)",
    transition:"0.3s"
  },

  footer:{
    marginTop:"30px",
    fontSize:"12px",
    opacity:0.7
  }

};

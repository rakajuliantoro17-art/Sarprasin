import { useEffect, useState } from "react";
import KPI from "../components/KPI";
import ChartComponent from "../components/Chart";
import Table from "../components/Table";

/* =========================
   CONFIG API
========================= */
const API_URL = "https://script.google.com/macros/s/AKfycbwQ91nYeiRja06EfLSuQk789XIy52g0TmD7dG6ETtV76dYajQP5eVx-49fz-T4GKX3-/exec?mode=api";

/* =========================
   PAGE
========================= */
export default function Executive(){

  const [data, setData] = useState({
    total: 0,
    baik: 0,
    perbaikan: 0,
    rusak: 0,
    list: []
  });

  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DATA
  ========================= */
  const fetchData = async () => {

    try{
      const res = await fetch(API_URL);
      const json = await res.json();

      setData({
        total: json.total || 0,
        baik: json.baik || 0,
        perbaikan: json.perbaikan || 0,
        rusak: json.rusak || 0,
        list: json.list || [] // kalau nanti kamu tambahin detail data
      });

      setLoading(false);

    }catch(err){
      console.error(err);
      setLoading(false);
    }
  };

  /* =========================
     AUTO REFRESH
  ========================= */
  useEffect(() => {

    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);

  }, []);

  /* =========================
     LOADING STATE
  ========================= */
  if(loading){
    return (
      <div style={styles.center}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  /* =========================
     INDEX SCORE
  ========================= */
  let percentage = 0;

  if(data.total > 0){
    const score =
      (data.baik * 1) +
      (data.perbaikan * 0.6) +
      (data.rusak * 0.2);

    percentage = Math.round((score / data.total) * 100);
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div style={styles.page}>

      {/* HEADER */}
      <h1 style={styles.title}>Executive Dashboard</h1>

      {/* KPI */}
      <div style={styles.grid}>
        <KPI label="Total Aset" value={data.total} />
        <KPI label="Baik" value={data.baik} type="baik" />
        <KPI label="Perbaikan" value={data.perbaikan} type="perbaikan" />
        <KPI label="Rusak" value={data.rusak} type="rusak" />
      </div>

      {/* CHART */}
      <div style={styles.card}>
        <h3>Distribusi Kondisi</h3>
        <ChartComponent 
          baik={data.baik}
          perbaikan={data.perbaikan}
          rusak={data.rusak}
        />
      </div>

      {/* INDEX */}
      <div style={styles.card}>
        <h3>Indeks Kelayakan</h3>

        <div style={styles.progress}>
          <div style={{
            ...styles.fill,
            width: percentage + "%",
          }}>
            {percentage}%
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div style={styles.card}>
        <h3>Data Aset</h3>
        <Table data={data.list} />
      </div>

    </div>
  );
}

/* =========================
   STYLE
========================= */
const styles = {

  page:{
    padding:"20px",
    minHeight:"100vh",
    background:"linear-gradient(160deg,#8E0E00,#1F1C18,#1e3c72)",
    color:"white"
  },

  title:{
    textAlign:"center",
    marginBottom:"20px"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",
    gap:"12px",
    marginBottom:"20px"
  },

  card:{
    background:"rgba(255,255,255,0.12)",
    backdropFilter:"blur(20px)",
    borderRadius:"20px",
    padding:"16px",
    marginBottom:"16px",
    boxShadow:"0 10px 30px rgba(0,0,0,0.3)"
  },

  progress:{
    width:"100%",
    height:"26px",
    background:"rgba(255,255,255,0.2)",
    borderRadius:"20px",
    overflow:"hidden",
    marginTop:"10px"
  },

  fill:{
    height:"100%",
    background:"linear-gradient(90deg,#2193b0,#6dd5ed)",
    textAlign:"center",
    lineHeight:"26px",
    fontWeight:"bold"
  },

  center:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    height:"100vh"
  }

};

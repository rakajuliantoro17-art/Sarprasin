import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ChartComponent({ baik = 0, perbaikan = 0, rusak = 0 }) {

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {

    const ctx = canvasRef.current;
    if (!ctx) return;

    // destroy chart lama biar tidak numpuk
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Baik", "Perbaikan", "Rusak"],
        datasets: [
          {
            data: [baik, perbaikan, rusak],
            backgroundColor: [
              "#34c759",
              "#ffcc00",
              "#ff3b30"
            ],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
              font: {
                size: 12
              }
            }
          }
        }
      }
    });

    // cleanup (WAJIB di React)
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };

  }, [baik, perbaikan, rusak]);

  return (
    <div style={{ height: "250px" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

# 🏫 SARPRAS SYSTEM – SMAN 1 SOOKO

Sistem digital pemetaan kondisi sarana dan prasarana sekolah berbasis **transparansi, partisipasi, dan data real-time**.

Dikembangkan untuk mendukung konsep **Sekolah 6.0** dengan pendekatan:

* 📊 Data-driven decision making
* 👥 Partisipasi seluruh warga sekolah
* 🔍 Transparansi kondisi sarpras secara terbuka

---

## 🚀 ARSITEKTUR SISTEM

Sistem ini menggunakan pendekatan **low-cost high-impact** dengan memanfaatkan layanan cloud:

* **Frontend**: Vercel
* **Backend API**: Google Apps Script
* **Database**: Google Sheets
* **File Storage**: Google Drive
* **Mobile App**: MIT App Inventor (WebView)

---

## 🧩 STRUKTUR SISTEM

```
/
├── api-config.js
├── vercel.json
├── user/
│   └── index.html
├── executive/
│   └── index.html (coming soon)
└── public/
    └── index.html (coming soon)
```

---

## 🧑‍💻 FITUR UTAMA

### 1. 📱 Dashboard User (Pelaporan)

Digunakan oleh:

* Wali Kelas
* Staff Kurikulum
* Staff Kesiswaan
* Staff Humas
* Tata Usaha

**Fitur:**

* Input laporan kondisi sarpras
* Upload foto (kamera langsung)
* Kategori & klasifikasi kerusakan
* Validasi user berbasis kode
* Status laporan (Diterima)

---

### 2. 🧠 Dashboard Executive (Manajemen)

Digunakan oleh:

* Kepala Sekolah
* Wakasek Sarpras

**Fitur:**

* Monitoring real-time kondisi sekolah
* KPI kerusakan (Normal, Perbaikan, Penting, Darurat)
* Data detail laporan
* Update status laporan

---

### 3. 🌍 Dashboard Publik

Ditampilkan di website sekolah

**Fitur:**

* Ringkasan kondisi sarpras
* Indeks kelayakan sekolah
* Transparansi data ke publik

---

## 🔐 KEAMANAN SISTEM

* API dilindungi dengan **API KEY**
* User tervalidasi melalui spreadsheet
* Tidak ada akses langsung ke database
* Drive tidak publik (hanya file laporan)

---

## 📊 STRUKTUR DATA (SPREADSHEET)

### Sheet: `Users`

| Kode | Nama | Role | Unit | Aktif |
| ---- | ---- | ---- | ---- | ----- |

---

### Sheet: `Laporan`

| ID | Timestamp | Kode | Nama | Role | Unit | Lokasi | Kategori | Jenis | Tingkat | Deskripsi | Foto | Status |
| -- | --------- | ---- | ---- | ---- | ---- | ------ | -------- | ----- | ------- | --------- | ---- | ------ |

---

## 🔁 FLOW SISTEM

1. User input laporan dari aplikasi
2. Data dikirim ke Apps Script API
3. Validasi user & input
4. Upload foto ke Drive
5. Simpan ke Spreadsheet
6. Dashboard membaca data secara real-time

---

## ⚙️ API ENDPOINT

### 🔹 Submit Laporan

```
POST /
```

### 🔹 Executive Dashboard

```
GET /?action=executive
```

### 🔹 Public Dashboard

```
GET /?action=public
```

---

## 🛠 DEPLOYMENT

### 1. Backend (Apps Script)

* Deploy sebagai **Web App**
* Akses: `Anyone with link`

---

### 2. Frontend (Vercel)

* Connect ke GitHub
* Pastikan struktur folder benar
* Gunakan `vercel.json` untuk routing

---

## ❗ TROUBLESHOOTING

### 404 di `/user`

* Pastikan folder: `/user/index.html`
* Tambahkan `vercel.json`

---

### API tidak jalan

* Cek `api-config.js`
* Pastikan URL Apps Script benar

---

### Upload foto gagal

* Cek permission Google Drive
* Pastikan format base64 valid

---

## 🎯 ROADMAP

* [ ] Dashboard Executive (visual analytics)
* [ ] Dashboard Publik (embed website)
* [ ] Notifikasi laporan
* [ ] Sistem prioritas perbaikan otomatis
* [ ] Integrasi QR Code ruangan

---

## 👨‍🏫 PENGEMBANG

Sistem ini dikembangkan untuk mendukung digitalisasi sarana dan prasarana di:

**SMAN 1 Sooko**

---

## 📌 LISENSI

Digunakan untuk kebutuhan internal sekolah dan pengembangan sistem pendidikan berbasis digital.

---

**SARPRAS SYSTEM © 2026**

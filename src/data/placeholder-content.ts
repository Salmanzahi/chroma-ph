/**
 * Content for the Bioplastic Anthocyanin pH Scanner.
 * All values sourced from ARGON UNAIR research context.
 * See docs/RESEARCH_CONTEXT.md for the full research summary.
 */

export const PLACEHOLDER = {
  projectName: "Bioplastic Anthocyanin pH Scanner",
  logo: "ARGON UNAIR",
  tagline: "Small Tech, Big Impact",
  mainTitle: "Pemindai pH Berbasis Antosianin",
  description:
    "Alat berbasis browser untuk memperkirakan pH dari warna film indikator bioplastik antosianin bunga telang (Clitoria ternatea).",
  image: "Film indikator bioplastik antosianin",
  teamName: "ARGON (Airlangga Student Research Group of Nanotechnology)",
  organization: "ARGON UNAIR",
  institution: "Universitas Airlangga, Surabaya, Jawa Timur",
} as const;

export const LANDING = {
  heroTitle: "Pemindai pH Berbasis Antosianin",
  heroDescription:
    "Alat berbasis browser untuk memperkirakan pH dari warna film indikator bioplastik antosianin bunga telang (Clitoria ternatea).",
  primaryCta: "Mulai Pindai",
  secondaryCta: "Lihat Skala pH",
  featureTitle1: "Pemindaian Warna Real-time",
  featureDesc1:
    "Arahkan kamera ke film indikator bioplastik dan dapatkan estimasi pH langsung di peramban.",
  featureTitle2: "Analisis Lokal Tanpa Server",
  featureDesc2:
    "Semua pemrosesan warna berjalan di perangkat Anda. Foto tidak dikirim ke server manapun.",
  featureTitle3: "Indikasi Kelayakan",
  featureDesc3:
    "Rentang pH 5,5–7 menunjukkan indikasi berdasarkan parameter penelitian ARGON UNAIR.",
  workflowStep1Title: "Arahkan Kamera",
  workflowStep1Desc:
    "Arahkan kamera ke film indikator bioplastik atau unggah foto dari galeri.",
  workflowStep2Title: "Konfirmasi Gambar",
  workflowStep2Desc:
    "Tinjau hasil tangkapan dan pastikan area indikator terlihat jelas.",
  workflowStep3Title: "Lihat Hasil",
  workflowStep3Desc:
    "Dapatkan perkiraan pH dan indikasi kelayakan berdasarkan parameter penelitian.",
  researchTitle: "Sintesis Bioplastik Antosianin Bunga Telang",
  researchDesc:
    "Film bioplastik dari pati jagung dan nanoselulosa alga dengan plasticizer gliserol-sorbitol, diekstrak antosianin dari Clitoria ternatea sebagai indikator pH.",
  finalCta: "Mulai Pindai Sekarang",
} as const;

export const ABOUT = {
  backgroundTitle: "Latar Belakang",
  backgroundDesc:
    "Proyek ini mengembangkan alat pemindai pH berbasis antosianin dari bunga telang (Clitoria ternatea) untuk aplikasi bioplastik. ARGON UNAIR melakukan riset sintesis bioplastik dari pati jagung dan nanoselulosa alga dengan tambahan gliserol dan sorbitol sebagai plasticizer.",
  objectiveTitle: "Tujuan Riset",
  objectiveDesc:
    "Mengembangkan bioplastik indikator pH yang fungsional dan ramah lingkungan, serta menyediakan alat pemindai warna berbasis browser untuk estimasi pH.",
  materialTitle: "Material",
  materialDesc:
    "Film bioplastik indikator pH berbasis antosianin bunga telang (Clitoria ternatea). Bahan utama: pati jagung, nanoselulosa dari alga, gliserol-sorbitol sebagai plasticizer, dan ekstrak antosianin.",
  processTitle: "Proses Umum",
  processDesc:
    "1) Sintesis nanoselulosa dari selulosa alga menggunakan asam sulfat dan sonikasi. 2) Ekstraksi antosianin dari bunga telang menggunakan etanol. 3) Fabrikasi bioplastik dengan menggabungkan nanoselulosa, pati jagung, plasticizer, dan ekstrak antosianin, kemudian dicetak dan dikeringkan.",
  teamTitle: "Tim",
  teamDesc: "ARGON (Airlangga Student Research Group of Nanotechnology)",
  orgTitle: "Organisasi",
  orgDesc:
    "Komunitas riset di Universitas Airlangga yang berfokus pada pengembangan dan implementasi penelitian nanoteknologi.",
  institutionTitle: "Institusi",
  institutionDesc: "Universitas Airlangga (UNAIR), Surabaya, Jawa Timur",
  documentationTitle: "Dokumentasi",
  documentationDesc:
    "Dokumentasi riset tersedia di repositori ARGON UNAIR.",
  creditsTitle: "Kredit",
  creditsDesc: "ARGON UNAIR Research Group — Small Tech, Big Impact",
} as const;

export const PH_SCALE = {
  pageTitle: "Skala pH Referensi",
  pageDescription:
    "Referensi 14 titik pH berdasarkan data kalibrasi sementara. Warna yang ditampilkan bersifat indikatif dan belum divalidasi secara laboratorium.",
  temporaryNotice:
    "Data kalibrasi ini bersifat sementara dan belum divalidasi secara ilmiah. Diperlukan data referensi final dari klien sebelum digunakan untuk pengukuran yang akurat.",
} as const;

export const SCANNER = {
  pageTitle: "Pindai Indikator",
  instructions:
    "Arahkan kamera ke film indikator bioplastik. Pastikan pencahayaan cukup dan merata.",
  processingLabel: "Menganalisis warna…",
  technicalDisclaimer:
    "Kamera, pencahayaan, dan kualitas gambar memengaruhi hasil analisis. Hasil bersifat perkiraan, bukan pengukuran laboratorium.",
} as const;

export const RESULT = {
  pageTitle: "Hasil Analisis",
  noResultTitle: "Tidak Ada Data Hasil",
  noResultDesc:
    "Belum ada hasil analisis yang tersedia. Lakukan pemindaian terlebih dahulu untuk melihat perkiraan pH.",
  goToScan: "Pindai Sekarang",
  calibrationNotice:
    "Kalibrasi warna bersifat sementara dan belum divalidasi secara ilmiah. Diperlukan data referensi final yang tervalidasi dari klien.",
  cameraLimitation:
    "Hasil dipengaruhi oleh kamera, pencahayaan, dan kualitas gambar. Gunakan pencahayaan yang cukup dan merata untuk hasil terbaik.",
  researchDisclaimer:
    "Indikasi kelayakan berdasarkan parameter penelitian ARGON UNAIR. Estimasi pH tidak menjamin keamanan pangan secara mandiri.",
  scanAnother: "Pindai Lagi",
  backToHome: "Kembali ke Beranda",
} as const;

export const NOT_FOUND = {
  title: "Halaman Tidak Ditemukan",
  description: "Halaman yang Anda cari tidak tersedia.",
  backHome: "Kembali ke Beranda",
} as const;

export const SHARED = {
  siteTitle: "Bioplastic | Indikator pH Antosianin — ARGON UNAIR",
  siteDescription:
    "Alat pemindai pH berbasis browser untuk film indikator bioplastik antosianin bunga telang (Clitoria ternatea). Dikembangkan oleh ARGON UNAIR.",
  navScan: "Pindai",
  navPhScale: "Skala pH",
  navAbout: "Tentang",
  navHome: "Beranda",
} as const;

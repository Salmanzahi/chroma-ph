/**
 * Placeholder content for unknown / unconfirmed client data.
 * Every value uses explicit Indonesian placeholder text.
 * Do NOT invent research claims, branding, team names, or institution names.
 */

export const PLACEHOLDER = {
  projectName: "Ini tempat nama project",
  logo: "Ini tempat logo",
  tagline: "Ini tempat tagline",
  mainTitle: "Ini tempat judul utama",
  description: "Ini tempat deskripsi",
  image: "Ini tempat gambar",
  teamName: "Ini tempat nama tim",
  organization: "Ini tempat organisasi",
  institution: "Ini tempat institusi",
} as const;

export const LANDING = {
  heroTitle: "Ini tempat judul utama",
  heroDescription:
    "Ini tempat deskripsi: alat berbasis browser untuk memperkirakan pH dari warna film indikator bioplastik antosianin bunga telang.",
  primaryCta: "Mulai Pindai",
  secondaryCta: "Lihat Skala pH",
  featureTitle1: "Ini tempat fitur 1",
  featureDesc1: "Ini tempat deskripsi fitur 1",
  featureTitle2: "Ini tempat fitur 2",
  featureDesc2: "Ini tempat deskripsi fitur 2",
  featureTitle3: "Ini tempat fitur 3",
  featureDesc3: "Ini tempat deskripsi fitur 3",
  workflowStep1Title: "Arahkan Kamera",
  workflowStep1Desc:
    "Arahkan kamera ke film indikator bioplastik atau unggah foto dari galeri.",
  workflowStep2Title: "Konfirmasi Gambar",
  workflowStep2Desc:
    "Tinjau hasil tangkapan dan pastikan area indikator terlihat jelas.",
  workflowStep3Title: "Lihat Hasil",
  workflowStep3Desc:
    "Dapatkan perkiraan pH dan indikasi kelayakan berdasarkan parameter penelitian.",
  researchTitle: "Ini tempat judul riset",
  researchDesc: "Ini tempat deskripsi riset",
  finalCta: "Mulai Pindai Sekarang",
} as const;

export const ABOUT = {
  backgroundTitle: "Latar Belakang",
  backgroundDesc:
    "Ini tempat deskripsi latar belakang proyek: pengembangan alat pemindai pH berbasis antosianin dari bunga telang untuk aplikasi bioplastik.",
  objectiveTitle: "Tujuan Riset",
  objectiveDesc:
    "Ini tempat deskripsi tujuan riset.",
  materialTitle: "Material",
  materialDesc:
    "Ini tempat deskripsi material: film bioplastik indikator pH berbasis antosianin bunga telang (Clitoria ternatea).",
  processTitle: "Proses Umum",
  processDesc:
    "Ini tempat deskripsi proses: tahapan umum pengembangan dan pengujian film indikator.",
  teamTitle: "Tim",
  teamDesc: "Ini tempat nama tim",
  orgTitle: "Organisasi",
  orgDesc: "Ini tempat organisasi",
  institutionTitle: "Institusi",
  institutionDesc: "Ini tempat institusi",
  documentationTitle: "Dokumentasi",
  documentationDesc: "Ini tempat dokumentasi",
  creditsTitle: "Kredit",
  creditsDesc: "Ini tempat kredit",
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
    "Indikasi kelayakan berdasarkan parameter penelitian. Estimasi pH tidak menjamin keamanan pangan secara mandiri.",
  scanAnother: "Pindai Lagi",
  backToHome: "Kembali ke Beranda",
} as const;

export const NOT_FOUND = {
  title: "Halaman Tidak Ditemukan",
  description: "Halaman yang Anda cari tidak tersedia.",
  backHome: "Kembali ke Beranda",
} as const;

export const SHARED = {
  siteTitle: "Bioplastic | Indikator pH Antosianin",
  siteDescription:
    "Alat pemindai pH berbasis browser untuk film indikator bioplastik antosianin bunga telang.",
  navScan: "Pindai",
  navPhScale: "Skala pH",
  navAbout: "Tentang",
  navHome: "Beranda",
} as const;

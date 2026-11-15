import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2cbcr3eyOCOLay1RK6pXFHbn0EhFnHwA",
  authDomain: "unicraft-esp.firebaseapp.com",
  projectId: "unicraft-esp",
  storageBucket: "unicraft-esp.firebasestorage.app",
  messagingSenderId: "655671137173",
  appId: "1:655671137173:web:d84ee3c4d1914b98ae1c9c",
  databaseURL: "https://unicraft-esp-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SAMPLE_PRESETS = [
  {
    bahanUji: "Air Shampoo",
    ph: 6.2,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 171, g: 164, b: 198 },
    hsl: { h: 252, s: 23, l: 71 },
    warna: "#aba4c6",
    volumeSolven: 100,
    volumeSolut: 5,
    satuanSolut: "mL",
    catatan: "Larutan shampoo rambut",
    createdAt: Date.now() - 600000,
  },
  {
    bahanUji: "Air Lemon",
    ph: 3.2,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 216, g: 118, b: 180 },
    hsl: { h: 322, s: 56, l: 65 },
    warna: "#d876b4",
    volumeSolven: 100,
    volumeSolut: 15,
    satuanSolut: "mL",
    catatan: "Perasan lemon murni dalam air suling",
    createdAt: Date.now() - 500000,
  },
  {
    bahanUji: "Air Keran",
    ph: 7.4,
    kategoriKualitatif: "Basa lemah",
    rgb: { r: 135, g: 145, b: 167 },
    hsl: { h: 221, s: 15, l: 59 },
    warna: "#8791a7",
    volumeSolven: 100,
    volumeSolut: 0,
    satuanSolut: "mL",
    catatan: "Air keran laboratorium",
    createdAt: Date.now() - 400000,
  },
  {
    bahanUji: "Air Gula",
    ph: 5.6,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 35, g: 0, b: 94 },
    hsl: { h: 262, s: 100, l: 18 },
    warna: "#23005e",
    volumeSolven: 100,
    volumeSolut: 20,
    satuanSolut: "gr",
    catatan: "Larutan gula pasir murni",
    createdAt: Date.now() - 300000,
  },
  {
    bahanUji: "Pembersih Lantai (Vixal)",
    ph: 3.4,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 82, g: 41, b: 72 },
    hsl: { h: 315, s: 33, l: 24 },
    warna: "#522948",
    volumeSolven: 200,
    volumeSolut: 5,
    satuanSolut: "mL",
    catatan: "Larutan pembersih lantai vixal",
    createdAt: Date.now() - 200000,
  },
  {
    bahanUji: "Soda (Sprite)",
    ph: 3.6,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 171, g: 81, b: 60 },
    hsl: { h: 307, s: 36, l: 49 },
    warna: "#ab513c",
    volumeSolven: 150,
    volumeSolut: 50,
    satuanSolut: "mL",
    catatan: "Minuman berkarbonasi soda",
    createdAt: Date.now() - 100000,
  },
  {
    bahanUji: "Soda Kue",
    ph: 8.1,
    kategoriKualitatif: "Basa lemah",
    rgb: { r: 54, g: 93, b: 105 },
    hsl: { h: 194, s: 32, l: 31 },
    warna: "#365d69",
    volumeSolven: 100,
    volumeSolut: 5,
    satuanSolut: "gr",
    catatan: "Larutan natrium bikarbonat",
    createdAt: Date.now(),
  },
];

async function syncFirestore() {
  console.log("Syncing phdetector collection in Firestore with note.txt...");
  const colRef = collection(db, "phdetector");
  const snap = await getDocs(colRef);
  
  console.log(`Clearing ${snap.size} existing documents...`);
  for (const docSnap of snap.docs) {
    await deleteDoc(doc(db, "phdetector", docSnap.id));
  }

  console.log(`Adding ${SAMPLE_PRESETS.length} items from note.txt...`);
  for (const item of SAMPLE_PRESETS) {
    const res = await addDoc(colRef, item);
    console.log(`Added "${item.bahanUji}" (pH ${item.ph}) -> ID: ${res.id}`);
  }
  console.log("Successfully synced all 7 items from note.txt to Firestore phdetector/!");
}

syncFirestore()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });

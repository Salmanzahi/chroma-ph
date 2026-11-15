import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyA2cbcr3eyOCOLay1RK6pXFHbn0EhFnHwA",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "unicraft-esp.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "unicraft-esp",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "unicraft-esp.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "655671137173",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:655671137173:web:d84ee3c4d1914b98ae1c9c",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://unicraft-esp-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export const FIRESTORE_COLLECTION_PH = "phdetector";

let firebaseApp: FirebaseApp;
let firestoreDb: Firestore;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

firestoreDb = getFirestore(firebaseApp);

export { firebaseApp, firestoreDb };

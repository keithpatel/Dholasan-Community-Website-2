import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDP075M7rdzaMbA-m3C_CbPDuhAxbZ_FJI",
  authDomain: "dholasan-64e52.firebaseapp.com",
  projectId: "dholasan-64e52",
  storageBucket: "dholasan-64e52.firebasestorage.app",
  messagingSenderId: "537515403763",
  appId: "1:537515403763:web:fde3cb81413d1426874a86",
  measurementId: "G-CF4BZV3SZK"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Safe Analytics initialization (prevents crashing when analytics is unsupported)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn("Firebase Analytics skipped:", e);
      }
    }
  }).catch(() => {});
}

// Safe Firestore initialization
let dbInstance: Firestore | null = null;
try {
  dbInstance = getFirestore(app);
} catch (e) {
  console.warn("Firestore initialization skipped:", e);
}

export const db = dbInstance;
export default app;

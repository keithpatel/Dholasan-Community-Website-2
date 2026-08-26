import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDP075M7rdzaMbA-m3C_CbPDuhAxbZ_FJI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dholasan-64e52.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dholasan-64e52",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "537515403763",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:537515403763:web:fde3cb81413d1426874a86",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CF4BZV3SZK"
};

const app = initializeApp(firebaseConfig);

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

export const db = getFirestore(app);

export const auth = getAuth(app);
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

export default app;
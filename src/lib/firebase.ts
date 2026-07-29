import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD75suz5V9bKQWzXF_VR7SUktp47oWd0H8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bnnm-3d1e3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bnnm-3d1e3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bnnm-3d1e3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1013538040065",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1013538040065:web:094e1f36230eadb4c45300",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-28V52RQP56",
};

let db: ReturnType<typeof getFirestore> | null = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch {
  // Firebase init failed — will use fallback data
}

export { db };

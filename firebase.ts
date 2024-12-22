// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "notion-clone-4ccd3.firebaseapp.com",
  projectId: "notion-clone-4ccd3",
  storageBucket: "notion-clone-4ccd3.firebasestorage.app",
  messagingSenderId: "191883230515",
  appId: "1:191883230515:web:2130c354edb96e49f29246",
  measurementId: "G-ZVT55PG5TP",
};

// Initialize Firebase (if has not yet been initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// Create a firestore connection
const db = getFirestore(app);

// export the database connection to firestore
export { db };

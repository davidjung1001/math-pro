// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDYEitybEOoc0NsBs1TE1SJgEWEd5yJeI",
  authDomain: "stillwater-math-pro.firebaseapp.com",
  projectId: "stillwater-math-pro",
  storageBucket: "stillwater-math-pro.appspot.com",
  messagingSenderId: "585789332007",
  appId: "1:585789332007:web:8c6f044421a3cbfa1ecc02",
  measurementId: "G-X3HW83XXTJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);

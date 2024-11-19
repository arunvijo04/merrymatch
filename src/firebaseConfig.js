// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDka2fpeq4DJtItjtrF7_9T0Eu5h-S2h38",
  authDomain: "merrymatch-cb3de.firebaseapp.com",
  projectId: "merrymatch-cb3de",
  storageBucket: "merrymatch-cb3de.appspot.com", // Corrected storage bucket
  messagingSenderId: "428283284269",
  appId: "1:428283284269:web:2045a25cdb153ccf85a1a4",
  measurementId: "G-2YTL4VSYPE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);

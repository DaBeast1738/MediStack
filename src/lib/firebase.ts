// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your Firebase configuration (from the Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyBxG_n63m8_ckOwV-OHJ_e1FThBdX50kOo",
  authDomain: "medistack-bff4e.firebaseapp.com",
  projectId: "medistack-bff4e",
  storageBucket: "medistack-bff4e.firebasestorage.app",
  messagingSenderId: "360876614184",
  appId: "1:360876614184:web:3bdbdcc254d1254cb30b1d",
  measurementId: "G-1913JF1BFY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export Firebase services
export const auth = getAuth(app) // Firebase Authentication
export const db = getFirestore(app) // Firestore Database
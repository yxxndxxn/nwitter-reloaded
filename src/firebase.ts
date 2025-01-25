// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC94g6P_QT0lZNV40vqJIG-hEGppLqe5bE",
  authDomain: "roommate-65208.firebaseapp.com",
  projectId: "roommate-65208",
  storageBucket: "roommate-65208.firebasestorage.app",
  messagingSenderId: "632142580032",
  appId: "1:632142580032:web:b228940dba0ae64609d2a5",
  measurementId: "G-G6F6X03YJX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); //인증 인스턴스

export const storage = getStorage(app);

export const db = getFirestore(app);

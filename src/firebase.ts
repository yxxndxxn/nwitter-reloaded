// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAhVg7wN3jWGUkegm2Zj8tH_c1fT2UdE4",
  authDomain: "nwitter-reloaded-34ebe.firebaseapp.com",
  projectId: "nwitter-reloaded-34ebe",
  storageBucket: "nwitter-reloaded-34ebe.firebasestorage.app",
  messagingSenderId: "845391556823",
  appId: "1:845391556823:web:d4d615acc1a03051a08092",
  measurementId: "G-ZP261X56ZP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); //인증 인스턴스

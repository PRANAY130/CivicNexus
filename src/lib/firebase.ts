// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWQhEjTAeBQDTuNYmflqWB6kjNyR4_v5U",
  authDomain: "civicpulse-9fe2f.firebaseapp.com",
  projectId: "civicpulse-9fe2f",
  storageBucket: "civicpulse-9fe2f.firebasestorage.app",
  messagingSenderId: "432002831184",
  appId: "1:432002831184:web:2010ec55f4e72eef1e9255",
  measurementId: "G-2Y3KDKT3YX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };

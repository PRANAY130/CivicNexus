// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbdimmanMdIRhzxzGDO0nZ5-Bn4-Dq2Vg",
  authDomain: "civicpulse-pwa.firebaseapp.com",
  projectId: "civicpulse-pwa",
  storageBucket: "civicpulse-pwa.firebasestorage.app",
  messagingSenderId: "764129977591",
  appId: "1:764129977591:web:bdc6c167602968acce5ff2"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };

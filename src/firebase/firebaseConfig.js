// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXBgGR5wp3MsMyBLes7ZsXzoipkpNzk2o",
  authDomain: "petdesing-c9122.firebaseapp.com",
  projectId: "petdesing-c9122",
  storageBucket: "petdesing-c9122.appspot.com",
  messagingSenderId: "332119849695",
  appId: "1:332119849695:web:66e9101882299d4618876a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

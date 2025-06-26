// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVCoO7YFvNAch1J9gr2ls11cPnJgQinoo",
  authDomain: "online-magazin-1cb48.firebaseapp.com",
  projectId: "online-magazin-1cb48",
  storageBucket: "online-magazin-1cb48.firebasestorage.app",
  messagingSenderId: "137830743804",
  appId: "1:137830743804:web:1a92aa01682d4a1bce6179",
  measurementId: "G-2W93YKN5VB",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export { db }

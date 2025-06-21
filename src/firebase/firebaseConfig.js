import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1KIzGCvifH-lzNzOtY0F__AL6PU7_B_Y",
  authDomain: "elbekproductions.firebaseapp.com",
  projectId: "elbekproductions",
  storageBucket: "elbekproductions.appspot.com",
  messagingSenderId: "467619718063",
  appId: "1:467619718063:web:f370881cffbb396899c55a"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

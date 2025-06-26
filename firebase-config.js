// Import Firebase core and Firestore service
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVCoO7YFvNAch1J9gr2ls11cPnJgQinoo",
  authDomain: "online-magazin-1cb48.firebaseapp.com",
  projectId: "online-magazin-1cb48",
  storageBucket: "online-magazin-1cb48.firebasestorage.app",
  messagingSenderId: "137830743804",
  appId: "1:137830743804:web:1a92aa01682d4a1bce6179",
  measurementId: "G-2W93YKN5VB"
};

// Initialize Firebase app (check if already initialized)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Export for use in other parts of your app
export { firebase, db, auth, storage };

// Import Firebase
import firebase from "firebase/app"
import "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Initialize Firestore
const db = firebase.firestore()

// Export for use in other files
export { db }
</merged_code>

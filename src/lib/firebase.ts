import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2Q3Qt3fs1c1uYEUyy8eZ3zxXfL1o8KR8",
  authDomain: "the-bomb-4fec2.firebaseapp.com",
  projectId: "the-bomb-4fec2",
  storageBucket: "the-bomb-4fec2.firebasestorage.app",
  messagingSenderId: "743402912782",
  appId: "1:743402912782:web:3665067e05d5b71b0ad05f",
  measurementId: "G-Y4X4R4NHKZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };

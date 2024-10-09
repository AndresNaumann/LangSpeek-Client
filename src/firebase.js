// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHgtA_cSblKTzjKEWxPzSeDxqy1vlvZj0",
  authDomain: "imrs-c84d8.firebaseapp.com",
  projectId: "imrs-c84d8",
  storageBucket: "imrs-c84d8.appspot.com",
  messagingSenderId: "114177885258",
  appId: "1:114177885258:web:fcebc3e730981c03a6d2b3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();

export { auth, db };

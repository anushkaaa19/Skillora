import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSSlGWxPSc35CKHsf3uE5O4k0UNhasmYU",
  authDomain: "skillora-7840c.firebaseapp.com",
  projectId: "skillora-7840c",
  storageBucket: "skillora-7840c.firebasestorage.app",
  messagingSenderId: "178510739650",
  appId: "1:178510739650:web:09be0dccada4c8ffc0635b",
  measurementId: "G-9EP1W5M07D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
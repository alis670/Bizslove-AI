// ✅ Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Your Firebase config (paste your keys here)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "bizslove-ai.firebaseapp.com",
  projectId: "bizslove-ai",
  storageBucket: "bizslove-ai.firebasestorage.app",
  messagingSenderId: "865426656421",
  appId: "1:865426656421:web:9f9a193177d1f7fa8a914c"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Make available globally
window.auth = auth;
window.RecaptchaVerifier = RecaptchaVerifier;
window.signInWithPhoneNumber = signInWithPhoneNumber;

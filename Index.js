import { initializeApp } from "firebase/app";
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHvqBobHL7jj-q8t_h9GLjddRvqPmY3hM",
  authDomain: "bizslove-ai.firebaseapp.com",
  projectId: "bizslove-ai",
  storageBucket: "bizslove-ai.firebasestorage.app",
  messagingSenderId: "865426656421",
  appId: "1:865426656421:web:9f9a193177d1f7fa8a914c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.registerUser = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => document.getElementById("msg").innerText = "✅ Account created! Login now.")
    .catch(err => document.getElementById("msg").innerText = err.message);
}

window.loginUser = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("msg").innerText = "✅ Login Successful!";
      window.location.href = "dashboard.html";
    })
    .catch(err => document.getElementById("msg").innerText = err.message);
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDHvqBobHL7jj-q8t_h9GLjddRvqPmY3hM",
  authDomain: "bizslove-ai.firebaseapp.com",
  projectId: "bizslove-ai",
  storageBucket: "bizslove-ai.firebasestorage.app",
  messagingSenderId: "865426656421",
  appId: "1:865426656421:web:9f9a193177d1f7fa8a914c"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Register User
window.registerUser = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("✅ Account created — now login"))
    .catch(err => alert(err.message));
};

// ✅ Login User
window.loginUser = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("✅ Login Successful");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
};

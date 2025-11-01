// dashboard.js - imports rely on modular firebase init present in your project.
// Make sure your firebase init has exported 'auth' and optionally 'db' if using Firestore.
// If you used earlier CDN approach, just import getAuth/getFirestore as needed.

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// (1) AUTH & FIRESTORE - use same firebaseConfig you added earlier (index.js)
const auth = getAuth();
const db = getFirestore();

// UI elements
const userEmailEl = document.getElementById("user-email");
const userUidEl = document.getElementById("user-uid");
const userPlanEl = document.getElementById("user-plan");
const btnLogout = document.getElementById("btn-logout");

// Excel
const fileInput = document.getElementById("file-input");
const excelPreview = document.getElementById("excel-preview");
const downloadCsvBtn = document.getElementById("download-csv");

// Calculators root
const calculatorsRoot = document.getElementById("calculators-root");

// Sheets integration
const appsScriptUrlInput = document.getElementById("apps-script-url");
const btnSendProfile = document.getElementById("btn-send-profile");
const btnCheckSheet = document.getElementById("btn-check-sheet");
const sheetStatus = document.getElementById("sheet-status");

// OTP
const phoneInput = document.getElementById("phone-number");
const btnSendOtp = document.getElementById("btn-send-otp");
const btnVerifyOtp = document.getElementById("btn-verify-otp");
const otpStatus = document.getElementById("otp-status");

// Admin demo
const adminEmail = document.getElementById("admin-email");
const btnAdminActivate = document.getElementById("btn-admin-activate");
const adminStatus = document.getElementById("admin-status");

// Helpers: show user on auth state change
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // not logged in — redirect to index/login
    window.location.href = "index.html";
    return;
  }
  userEmailEl.innerText = user.email || "—";
  userUidEl.innerText = user.uid || "—";

  // get plan from Firestore if exists
  try {
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      userPlanEl.innerText = data.plan || "Free";
    } else {
      // write default doc
      await setDoc(docRef, { email: user.email, uid: user.uid, plan: "Free", createdAt: new Date().toISOString() });
      userPlanEl.innerText = "Free";
    }
  } catch (err) {
    console.warn("Firestore error:", err);
  }
});

// Logout
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

/* ---------------- Excel preview & download ---------------- */
downloadCsvBtn.addEventListener("click", () => {
  const csv = `Month,Revenue,Expenses,Net
Jan,1000,400,600
Feb,1200,450,750
Mar,1400,480,920
`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "bizslove_cashflow.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// Read and preview Excel
fileInput.addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const data = await f.arrayBuffer();
  const wb = XLSX.read(data);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_html(sheet);
  excelPreview.innerHTML = json;
});

/* ---------------- Calculators (add multiple tools) ---------------- */
function createCalculatorUI() {
  calculatorsRoot.innerHTML = `
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <div style="flex:1;min-width:220px">
        <h4>Profit Margin</h4>
        <input id="c_rev" placeholder="Revenue">
        <input id="c_cost" placeholder="Cost">
        <button id="c_btn_profit" class="btn">Calc Margin</button>
        <div id="c_out_profit" class="small-muted"></div>
      </div>

      <div style="flex:1;min-width:220px">
        <h4>Break Even (units)</h4>
        <input id="c_fixed" placeholder="Fixed cost">
        <input id="c_price" placeholder="Price per unit">
        <input id="c_var" placeholder="Variable cost per unit">
        <button id="c_btn_be" class="btn">Calc BE</button>
        <div id="c_out_be" class="small-muted"></div>
      </div>

      <div style="flex:1;min-width:220px">
        <h4>Marketing ROI</h4>
        <input id="c_rev_m" placeholder="Campaign revenue">
        <input id="c_spend_m" placeholder="Campaign spend">
        <button id="c_btn_roi" class="btn">Calc ROI</button>
        <div id="c_out_roi" class="small-muted"></div>
      </div>
    </div>
  `;

  document.getElementById("c_btn_profit").onclick = () => {
    const rev = parseFloat(document.getElementById("c_rev").value) || 0;
    const cost = parseFloat(document.getElementById("c_cost").value) || 0;
    if (rev <= 0) return (document.getElementById("c_out_profit").innerText = "Enter revenue > 0");
    const margin = ((rev - cost) / rev) * 100;
    document.getElementById("c_out_profit").innerText = `Profit margin: ${margin.toFixed(2)}%`;
  };

  document.getElementById("c_btn_be").onclick = () => {
    const fixed = parseFloat(document.getElementById("c_fixed").value) || 0;
    const price = parseFloat(document.getElementById("c_price").value) || 0;
    const variable = parseFloat(document.getElementById("c_var").value) || 0;
    const contrib = price - variable;
    if (contrib <= 0) return (document.getElementById("c_out_be").innerText = "Price must be > variable cost");
    const units = Math.ceil(fixed / contrib);
    document.getElementById("c_out_be").innerText = `Break-even units: ${units}`;
  };

  document.getElementById("c_btn_roi").onclick = () => {
    const rev = parseFloat(document.getElementById("c_rev_m").value) || 0;
    const spend = parseFloat(document.getElementById("c_spend_m").value) || 0;
    if (spend <= 0) return (document.getElementById("c_out_roi").innerText = "Enter marketing spend > 0");
    const roi = (rev - spend) / spend;
    document.getElementById("c_out_roi").innerText = `ROI: ${roi.toFixed(2)} (e.g. 1.5 = 150%)`;
  };
}
createCalculatorUI();

/* ---------------- Google Sheets -> Apps Script sender ---------------- */
btnSendProfile.addEventListener("click", async () => {
  const url = appsScriptUrlInput.value.trim();
  if (!url) return (sheetStatus.innerText = "Paste your Apps Script Web App URL first.");
  const user = auth.currentUser;
  if (!user) return (sheetStatus.innerText = "User not found.");
  sheetStatus.innerText = "Sending...";
  try {
    const res = await axios.post(url, { email: user.email, uid: user.uid, action: "signup", time: new Date().toISOString() });
    sheetStatus.innerText = "Sent — response: " + (res.data && typeof res.data === "string" ? res.data : "OK");
  } catch (e) {
    sheetStatus.innerText = "Error: " + (e.message || "failed");
  }
});

btnCheckSheet.addEventListener("click", async () => {
  const url = appsScriptUrlInput.value.trim();
  if (!url) return (sheetStatus.innerText = "Paste your Apps Script URL first.");
  sheetStatus.innerText = "Testing...";
  try {
    const res = await axios.get(url + "?test=1");
    sheetStatus.innerText = "Webhook test: " + JSON.stringify(res.data).slice(0,200);
  } catch (e) {
    sheetStatus.innerText = "Error: " + (e.message || "failed");
  }
});

/* ---------------- Phone OTP (wire after enabling phone auth) ---------------- */
btnSendOtp.addEventListener("click", async () => {
  otpStatus.innerText = "";
  const phone = phoneInput.value.trim();
  if (!phone) return (otpStatus.innerText = "Enter phone number with country code.");
  // phone_auth.js exposes startPhoneAuth(window.recaptchaVerifier, phone)
  try {
    otpStatus.innerText = "Sending OTP...";
    await window.startPhoneAuth(phone); // function in phone_auth.js (uses global recaptcha setup)
    otpStatus.innerText = "OTP sent — check your phone.";
  } catch (err) {
    otpStatus.innerText = "Error sending OTP: " + (err.message || err);
  }
});

btnVerifyOtp.addEventListener("click", async () => {
  const code = document.getElementById("otp-code").value.trim();
  if (!code) return (otpStatus.innerText = "Enter OTP code.");
  try {
    const result = await window.verifyPhoneOtp(code); // phone_auth.js
    otpStatus.innerText = "Phone authenticated. UID: " + result.user.uid;
  } catch (err) {
    otpStatus.innerText = "Error verifying OTP: " + err.message;
  }
});

/* ---------------- Admin demo (client-side only) ---------------- */
btnAdminActivate.addEventListener("click", async () => {
  const email = adminEmail.value.trim();
  if (!email) return (adminStatus.innerText = "Enter user email to activate.");
  // Demo: in production call a secure endpoint to update Firestore / database
  adminStatus.innerText = "Activated (demo): " + email;
});

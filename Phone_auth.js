// ✅ Setup reCAPTCHA
window.onload = function() {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "normal",
  });
};

function sendOTP() {
  const phone = document.getElementById("phone").value;

  signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
    .then(confirmationResult => {
      window.confirmationResult = confirmationResult;
      alert("OTP Sent ✅");
    })
    .catch(error => {
      alert(error.message);
    });
}

function verifyOTP() {
  const code = document.getElementById("otp").value;

  window.confirmationResult.confirm(code)
    .then(() => {
      alert("Phone Login Successful ✅");
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("Wrong OTP ❌");
    });
}

window.sendOTP = sendOTP;
window.verifyOTP = verifyOTP;

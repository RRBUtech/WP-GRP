document.addEventListener("DOMContentLoaded", function () {
  const resetForm = document.getElementById("resetPasswordForm");
  const trnInput = document.getElementById("trn");
  const emailInput = document.getElementById("email");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const trnError = document.getElementById("trnError");
  const emailError = document.getElementById("emailError");
  const newPasswordError = document.getElementById("newPasswordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  resetForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous errors
    trnError.textContent = "";
    emailError.textContent = "";
    newPasswordError.textContent = "";
    confirmPasswordError.textContent = "";

    const trn = trnInput.value.trim();
    const email = emailInput.value.trim();
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    let isValid = true;

    // TRN validation
    if (!trn) {
      trnError.textContent = "TRN is required";
      isValid = false;
    } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/.test(trn)) {
      trnError.textContent = "TRN must be in format: 000-000-000";
      isValid = false;
    }

    // Email validation
    if (!email) {
      emailError.textContent = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.textContent = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!newPassword) {
      newPasswordError.textContent = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      newPasswordError.textContent =
        "Password must be at least 8 characters long";
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      confirmPasswordError.textContent = "Please confirm your password";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      confirmPasswordError.textContent = "Passwords do not match";
      isValid = false;
    }

    if (!isValid) return;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    // Find user by TRN and email
    const userIndex = users.findIndex(
      (u) => u.trn === trn && u.email === email
    );

    if (userIndex === -1) {
      trnError.textContent = "TRN and email combination not found";
      return;
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem("RegistrationData", JSON.stringify(users));

    // Show success message and redirect
    alert("Password reset successful! Please login with your new password.");
    window.location.href = "login.html";
  });

  // Reset form when Cancel button is clicked
  resetForm.addEventListener("reset", function () {
    trnError.textContent = "";
    emailError.textContent = "";
    newPasswordError.textContent = "";
    confirmPasswordError.textContent = "";
  });
});

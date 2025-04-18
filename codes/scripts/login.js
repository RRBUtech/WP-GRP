/* QUESTION 1B 
b.	Login Page:
      i.	create a login form where visitors can enter their trn and password provided at registration.
      ii.	validate this login data by checking the currently entered trn and password against data associated with the localStorage key called, RegistrationData. 
      iii.	a visitor is given three (3) attempts to enter a correct trn and password. If login is successful, redirect the user to the product catalog. Otherwise, redirect the user to an error/account locked page.
Include the following:
      iv.	Login button (validate user login information)
      v.	Cancel button (used to clear data from the Login form)
      vi.	Reset Password hyperlink (used to allow the user to change their password that is associated with the localStorage key called, RegistrationData by matching their trn.

*/
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const trnInput = document.getElementById("trn");
  const passwordInput = document.getElementById("password");
  const trnError = document.getElementById("trnError");
  const passwordError = document.getElementById("passwordError");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous errors
    trnError.textContent = "";
    passwordError.textContent = "";

    const trn = trnInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic validation
    if (!trn) {
      trnError.textContent = "TRN is required";
      return;
    }

    if (!password) {
      passwordError.textContent = "Password is required";
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    // Find user by TRN and password
    const user = users.find((u) => u.trn === trn && u.password === password);

    if (user) {
      // Store current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Redirect based on user role
      if (user.role === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      // Check if TRN exists but password is wrong
      const userExists = users.some((u) => u.trn === trn);
      if (userExists) {
        passwordError.textContent = "Incorrect password";
      } else {
        trnError.textContent = "TRN not found. Please register first.";
      }
    }
  });
});

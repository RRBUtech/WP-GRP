/* QUESTION 1
1.	User Authentication (LocalStorage)
a.	Registration Page:
i.	create a registration form where users can enter their first name, last name, date of birth, gender, phone number, email, tax registration number (trn), and password, etc. 
Validate the form to ensure:
ii.	all fields are filled (HTML validation). Js Error handling.
iii.	passwords should be at least 8 characters long.
iv.	visitor must be over 18 years old to register. Calculate using JavaScript.
v.	trn is unique; must be of length and in the format (000-000-000). **trn is used instead of a username with login.
vi.	store registration information (ie. first name, last name, date of birth, gender, phone number, email, tax registration number (trn), password, date of registration, cart{}, invoices[]) as a JavaScript object. Each registration record must be appended to localStorage key called RegistrationData using JavaScript (as an array of objects.)
Include the following buttons: 
vii.	Register (used to stored registration form data) 
viii.	Cancel (used to clear data from the registration form)
*/
// Initialize login attempts in localStorage if not exists
if (!localStorage.getItem("loginAttempts")) {
  localStorage.setItem("loginAttempts", JSON.stringify({}));
}

// Initialize RegistrationData in localStorage if not exists
if (!localStorage.getItem("RegistrationData")) {
  localStorage.setItem("RegistrationData", JSON.stringify([]));
}

// Default admin user
const DEFAULT_ADMIN = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@jamaicaautospa.com",
  password: "admin123", // In a real application, this should be hashed
  trn: "999-999-999",
  dob: "1990-01-01",
  gender: "other",
  role: "admin",
  cart: {},
  invoices: [],
};

// Initialize admin user if not exists
function initializeAdminUser() {
  const registrationData = JSON.parse(
    localStorage.getItem("RegistrationData") || "[]"
  );
  const adminExists = registrationData.some((user) => user.role === "admin");

  if (!adminExists) {
    registrationData.push(DEFAULT_ADMIN);
    localStorage.setItem("RegistrationData", JSON.stringify(registrationData));
  }
}

// Check if user is logged in
function checkLoginStatus() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Login function
function login(email, password) {
  const registrationData = JSON.parse(
    localStorage.getItem("RegistrationData") || "[]"
  );
  const user = registrationData.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return true;
  }
  return false;
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// Register function
function register(userData) {
  const registrationData = JSON.parse(
    localStorage.getItem("RegistrationData") || "[]"
  );

  // Check if user already exists
  if (registrationData.some((user) => user.email === userData.email)) {
    return false;
  }

  // Set default role as user
  userData.role = "user";
  userData.cart = {};
  userData.invoices = [];

  registrationData.push(userData);
  localStorage.setItem("RegistrationData", JSON.stringify(registrationData));
  return true;
}

// Check if user is admin
function isAdmin() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser?.role === "admin";
}

document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const trn = document.getElementById("trn").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // Get login attempts
  const loginAttempts = JSON.parse(localStorage.getItem("loginAttempts"));

  // Check if account is locked
  if (loginAttempts[trn] && loginAttempts[trn] >= 3) {
    errorMessage.textContent = "Account is locked. Please reset your password.";
    return;
  }

  // Get registered users
  const registrationData = JSON.parse(
    localStorage.getItem("RegistrationData") || "[]"
  );
  const user = registrationData.find((user) => user.trn === trn);

  if (!user) {
    handleFailedLogin(trn, errorMessage, "Invalid TRN or password.");
    return;
  }

  if (user.password !== password) {
    handleFailedLogin(trn, errorMessage, "Invalid TRN or password.");
    return;
  }

  // Successful login
  localStorage.setItem("currentUser", JSON.stringify(user));
  resetLoginAttempts(trn);
  window.location.href = "products.html";
});

// Registration Form Handler
document
  .getElementById("registrationForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const trn = document.getElementById("trn").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("error-message");

    // Validate age (must be over 18)
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      errorMessage.textContent = "You must be 18 or older to register.";
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match.";
      return;
    }

    // Validate TRN format
    const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
      errorMessage.textContent = "TRN must be in format: 000-000-000";
      return;
    }

    // Check if TRN already exists
    const registrationData = JSON.parse(
      localStorage.getItem("RegistrationData") || "[]"
    );
    if (registrationData.some((user) => user.trn === trn)) {
      errorMessage.textContent = "This TRN is already registered.";
      return;
    }

    // Create new user object
    const newUser = {
      firstName,
      lastName,
      dob,
      gender,
      phone,
      email,
      trn,
      password,
      dateRegistered: new Date().toISOString(),
      cart: {},
      invoices: [],
    };

    // Add to registration data
    registrationData.push(newUser);
    localStorage.setItem("RegistrationData", JSON.stringify(registrationData));

    // Redirect to login page
    alert("Registration successful! Please login with your TRN and password.");
    window.location.href = "login.html";
  });

// Password Reset Form Handler
document
  .getElementById("resetPasswordForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    const trn = document.getElementById("trn").value;
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("error-message");

    // Get registered users
    const registrationData = JSON.parse(
      localStorage.getItem("RegistrationData") || "[]"
    );
    const userIndex = registrationData.findIndex(
      (user) => user.trn === trn && user.email === email
    );

    if (userIndex === -1) {
      errorMessage.textContent =
        "No account found with this TRN and email combination.";
      return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match.";
      return;
    }

    // Update password
    registrationData[userIndex].password = newPassword;
    localStorage.setItem("RegistrationData", JSON.stringify(registrationData));

    // Reset login attempts
    resetLoginAttempts(trn);

    // Redirect to login page
    alert("Password reset successful! Please login with your new password.");
    window.location.href = "login.html";
  });

function handleFailedLogin(trn, errorElement, message) {
  const loginAttempts = JSON.parse(localStorage.getItem("loginAttempts"));
  loginAttempts[trn] = (loginAttempts[trn] || 0) + 1;
  localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));

  const remainingAttempts = 3 - loginAttempts[trn];
  if (remainingAttempts <= 0) {
    errorElement.textContent = "Account is locked. Please reset your password.";
  } else {
    errorElement.textContent = `${message} ${remainingAttempts} attempts remaining.`;
  }
}

function resetLoginAttempts(trn) {
  const loginAttempts = JSON.parse(localStorage.getItem("loginAttempts"));
  delete loginAttempts[trn];
  localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));
}

// Clear form on cancel
document
  .querySelector('button[type="reset"]')
  ?.addEventListener("click", function () {
    document.getElementById("error-message").textContent = "";
  });

// Initialize admin user when the script loads
initializeAdminUser();

// Check if user is logged in and is admin
function checkAdminAccess() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function refreshDashboard() {
  if (!checkAdminAccess()) return;

  // Get and display gender statistics
  const registrationData = JSON.parse(
    localStorage.getItem("RegistrationData") || "[]"
  );
  const genderFrequency = {
    male: 0,
    female: 0,
    other: 0,
  };

  registrationData.forEach((user) => {
    genderFrequency[user.gender.toLowerCase()]++;
  });

  const genderStats = document.getElementById("gender-stats");
  genderStats.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${genderFrequency.male}</div>
            <div>Male</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${genderFrequency.female}</div>
            <div>Female</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${genderFrequency.other}</div>
            <div>Other</div>
        </div>
    `;

  // Get and display age statistics
  const ageGroups = {
    "18-25": 0,
    "26-35": 0,
    "36-50": 0,
    "50+": 0,
  };

  registrationData.forEach((user) => {
    const birthDate = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age <= 25) ageGroups["18-25"]++;
    else if (age <= 35) ageGroups["26-35"]++;
    else if (age <= 50) ageGroups["36-50"]++;
    else ageGroups["50+"]++;
  });

  const ageStats = document.getElementById("age-stats");
  ageStats.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${ageGroups["18-25"]}</div>
            <div>18-25</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${ageGroups["26-35"]}</div>
            <div>26-35</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${ageGroups["36-50"]}</div>
            <div>36-50</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${ageGroups["50+"]}</div>
            <div>50+</div>
        </div>
    `;

  // Display invoices
  const allInvoices = JSON.parse(localStorage.getItem("AllInvoices") || "[]");
  const invoicesList = document.getElementById("invoices-list");
  invoicesList.innerHTML = allInvoices
    .map(
      (invoice) => `
        <tr>
            <td>${invoice.invoiceNumber}</td>
            <td>${invoice.customerInfo.name}</td>
            <td>${new Date(invoice.date).toLocaleDateString()}</td>
            <td>$${invoice.charges.total.toFixed(2)}</td>
        </tr>
    `
    )
    .join("");
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  if (checkAdminAccess()) {
    refreshDashboard();
  }
});

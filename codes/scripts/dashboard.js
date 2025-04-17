/*QUESTION 6 
6.	Additional Functionality:
      a.	ShowUserFrequency() – Show’s user requency based on Gender and Age Group:
      i.	show how many registered users fall under specific gender categories (e.g. Male, Female, Other)
      ii.	show how many registered users fall under different age groups (e.g., 18-25, 26-35, 36-50, 50+).
      iii.	Display this data on a dashboard or a separate page. 
b.	ShowInvoices() - displays all invoices and allow the visitor to search for any of the invoices (using trn) stored in AllInvoices from localStorage using console.log().
c.	GetUserInvoices() – displays all the invoices for a user based on trn stored in the localStorage key called, RegisterData. 


*/
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

// Check if user is logged in
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cartItems = JSON.parse(localStorage.getItem("checkoutCart"));
  const charges = JSON.parse(localStorage.getItem("charges"));

  // Generate unique invoice number (timestamp + last 4 of TRN)
  const invoiceNumber = `INV-${Date.now()}-${currentUser.trn.slice(-4)}`;

  // Create invoice object
  const invoice = {
    invoiceNumber,
    companyName: "Jamaica Auto Spa",
    date: new Date().toISOString(),
    customerInfo: {
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      trn: currentUser.trn,
      email: currentUser.email,
    },
    items: Object.values(cartItems),
    charges: charges,
  };

  // Display invoice details
  displayInvoice(invoice);

  // Handle print functionality
  document.getElementById("printInvoice").addEventListener("click", () => {
    window.print();
  });

  // Handle complete order functionality
  document.getElementById("completeOrder").addEventListener("click", () => {
    // Save invoice to user's invoices array
    currentUser.invoices.push(invoice);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update user's invoices in RegistrationData
    const registrationData = JSON.parse(
      localStorage.getItem("RegistrationData")
    );
    const userIndex = registrationData.findIndex(
      (user) => user.trn === currentUser.trn
    );
    if (userIndex !== -1) {
      registrationData[userIndex].invoices.push(invoice);
      localStorage.setItem(
        "RegistrationData",
        JSON.stringify(registrationData)
      );
    }

    // Save invoice to AllInvoices
    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices") || "[]");
    allInvoices.push(invoice);
    localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

    // Clear cart
    currentUser.cart = {};
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.removeItem("checkoutCart");
    localStorage.removeItem("charges");

    // Show email notification
    alert(`Invoice #${invoiceNumber} has been sent to ${currentUser.email}`);

    // Redirect to products page
    window.location.href = "products.html";
  });

  // Handle cancel functionality
  document.getElementById("cancelOrder").addEventListener("click", () => {
    localStorage.removeItem("checkoutCart");
    localStorage.removeItem("charges");
    window.location.href = "products.html";
  });

  // Handle exit functionality
  document.getElementById("exit").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

function displayInvoice(invoice) {
  // Display company info
  document.getElementById("company-name").textContent = invoice.companyName;
  document.getElementById("invoice-number").textContent = invoice.invoiceNumber;
  document.getElementById("invoice-date").textContent = new Date(
    invoice.date
  ).toLocaleDateString();

  // Display customer info
  document.getElementById("customer-name").textContent =
    invoice.customerInfo.name;
  document.getElementById("customer-trn").textContent =
    invoice.customerInfo.trn;
  document.getElementById("customer-email").textContent =
    invoice.customerInfo.email;

  // Display items
  const cartItemsContainer = document.getElementById("cart-items");
  invoice.items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.qty).toFixed(2)}</td>
        `;
    cartItemsContainer.appendChild(row);
  });

  // Display charges
  document.getElementById("subtotal").textContent =
    invoice.charges.subtotal.toFixed(2);
  document.getElementById("tax").textContent = invoice.charges.tax.toFixed(2);
  document.getElementById("discount").textContent =
    invoice.charges.discount.toFixed(2);
  document.getElementById("total").textContent =
    invoice.charges.total.toFixed(2);
}

// Analysis Functions
function ShowUserFrequency() {
  const registrationData = JSON.parse(
    localStorage.getItem("RegistrationData") || "[]"
  );

  // Gender frequency
  const genderFrequency = {
    male: 0,
    female: 0,
    other: 0,
  };

  // Age group frequency
  const ageGroups = {
    "18-25": 0,
    "26-35": 0,
    "36-50": 0,
    "50+": 0,
  };

  registrationData.forEach((user) => {
    // Count gender
    genderFrequency[user.gender.toLowerCase()]++;

    // Calculate age and count age group
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

  console.log("User Frequency by Gender:", genderFrequency);
  console.log("User Frequency by Age Group:", ageGroups);
}

function ShowInvoices() {
  const allInvoices = JSON.parse(localStorage.getItem("AllInvoices") || "[]");
  console.log("All Invoices:", allInvoices);
}

function GetUserInvoices(trn) {
  const registrationData = JSON.parse(
    localStorage.getItem("RegistrationData") || "[]"
  );
  const user = registrationData.find((user) => user.trn === trn);
  if (user) {
    console.log(`Invoices for TRN ${trn}:`, user.invoices);
  } else {
    console.log(`No user found with TRN ${trn}`);
  }
}

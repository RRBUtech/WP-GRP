/*QUESTION 5
5.	Invoice Generation:
  a.	After checkout, generate an invoice with the following details:
      `Name of company`
      `Date of invoice`
      `Shipping information` (from checkout)
      `Invoice number` (unique)
      ‘trn’
      `Purchased items` (name, quantity, price, discount)
      `Taxes`
      `Subtotal`
      `Total cost`
b.	Append this invoice to the user’s array of invoices (array of objects). Also store the invoice to localStorage with the key called AllInvoices (as an array of objects) to access later.
    After generating the invoice
c.	Optionally, display a message indicating that the invoice has been “sent” to the user’s email.
*/

// Check if user is logged in
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cartItems = JSON.parse(localStorage.getItem("checkoutCart") || "{}");
  const charges = JSON.parse(localStorage.getItem("charges") || "{}");

  // Generate unique invoice number (timestamp + last 4 of TRN)
  const invoiceNumber = `INV-${Date.now()}-${currentUser.trn.slice(-4)}`;

  // Display invoice details
  document.getElementById("invoice-number").textContent = invoiceNumber;
  document.getElementById("invoice-date").textContent =
    new Date().toLocaleDateString();
  document.getElementById(
    "customer-name"
  ).textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById("customer-email").textContent = currentUser.email;
  document.getElementById("customer-phone").textContent = currentUser.phone;

  // Display cart items
  const cartItemsContainer = document.getElementById("invoice-items");
  Object.entries(cartItems).forEach(([id, item]) => {
    const row = document.createElement("tr");
    const itemTotal = item.price * item.qty;

    row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;
    cartItemsContainer.appendChild(row);
  });

  // Display charges
  document.getElementById("invoice-subtotal").textContent =
    charges.subtotal.toFixed(2);
  document.getElementById("invoice-tax").textContent = charges.tax.toFixed(2);
  document.getElementById("invoice-total").textContent =
    charges.total.toFixed(2);

  // Handle print invoice
  document
    .getElementById("print-invoice")
    .addEventListener("click", function () {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice ${invoiceNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .invoice-header { text-align: center; margin-bottom: 30px; }
                .invoice-details { margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
                .totals { text-align: right; }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1>Jamaica Auto Spa</h1>
                <p>123 Auto Street, Kingston, Jamaica</p>
                <p>Phone: (876) 555-0123 | Email: info@jamaicaautospa.com</p>
            </div>
            <div class="invoice-details">
                <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Customer:</strong> ${
                  currentUser.firstName
                } ${currentUser.lastName}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Phone:</strong> ${currentUser.phone}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(cartItems)
                      .map(
                        ([id, item]) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.qty}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
            <div class="totals">
                <p>Subtotal: $${charges.subtotal.toFixed(2)}</p>
                <p>Tax: $${charges.tax.toFixed(2)}</p>
                <p><strong>Total: $${charges.total.toFixed(2)}</strong></p>
            </div>
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
    });

  // Handle back to cart
  document
    .getElementById("back-to-cart")
    .addEventListener("click", function () {
      window.location.href = "cart.html";
    });

  // Handle confirm order
  document
    .getElementById("confirm-order")
    .addEventListener("click", function () {
      // Create invoice object
      const invoice = {
        invoiceNumber,
        date: new Date().toISOString(),
        customerInfo: {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          email: currentUser.email,
          phone: currentUser.phone,
          trn: currentUser.trn,
        },
        items: Object.values(cartItems),
        charges: charges,
      };

      // Save invoice to user's invoices array
      if (!currentUser.invoices) {
        currentUser.invoices = [];
      }
      currentUser.invoices.push(invoice);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Update user in RegistrationData
      const registrationData = JSON.parse(
        localStorage.getItem("RegistrationData") || "[]"
      );
      const userIndex = registrationData.findIndex(
        (user) => user.trn === currentUser.trn
      );
      if (userIndex !== -1) {
        registrationData[userIndex] = currentUser;
        localStorage.setItem(
          "RegistrationData",
          JSON.stringify(registrationData)
        );
      }

      // Save invoice to AllInvoices
      const allInvoices = JSON.parse(
        localStorage.getItem("AllInvoices") || "[]"
      );
      allInvoices.push(invoice);
      localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

      // Clear cart
      currentUser.cart = {};
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Update user in RegistrationData again with empty cart
      if (userIndex !== -1) {
        registrationData[userIndex] = currentUser;
        localStorage.setItem(
          "RegistrationData",
          JSON.stringify(registrationData)
        );
      }

      // Clear checkout data
      localStorage.removeItem("checkoutCart");
      localStorage.removeItem("charges");

      // alert("Order confirmed! Thank you for your business.");
      alert(`Invoice #${invoiceNumber} has been sent to ${currentUser.email}`);
      window.location.href = "index.html";
    });
});

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

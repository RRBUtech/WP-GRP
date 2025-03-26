// Check if user is logged in
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Display profile information
  const profileInfo = document.getElementById("profile-info");
  profileInfo.innerHTML = `
        <div class="profile-info-item">
            <h3>Full Name</h3>
            <p>${currentUser.firstName} ${currentUser.lastName}</p>
        </div>
        <div class="profile-info-item">
            <h3>Email</h3>
            <p>${currentUser.email}</p>
        </div>
        <div class="profile-info-item">
            <h3>Phone</h3>
            <p>${currentUser.phone}</p>
        </div>
        <div class="profile-info-item">
            <h3>TRN</h3>
            <p>${currentUser.trn}</p>
        </div>
    `;

  // Display invoice history
  const invoiceList = document.getElementById("invoice-list");

  if (!currentUser.invoices || currentUser.invoices.length === 0) {
    invoiceList.innerHTML = `
            <div class="no-invoices">
                <p>You haven't made any purchases yet.</p>
                <a href="products.html" class="btn-primary">Browse Services</a>
            </div>
        `;
    return;
  }

  // Sort invoices by date (newest first)
  const sortedInvoices = [...currentUser.invoices].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Display each invoice
  sortedInvoices.forEach((invoice) => {
    const invoiceCard = document.createElement("div");
    invoiceCard.className = "invoice-card";

    const invoiceDate = new Date(invoice.date).toLocaleDateString();

    invoiceCard.innerHTML = `
            <div class="invoice-header">
                <span class="invoice-number">${invoice.invoiceNumber}</span>
                <span class="invoice-date">${invoiceDate}</span>
            </div>
            <div class="invoice-items">
                ${invoice.items
                  .map(
                    (item) => `
                    <div class="invoice-item">
                        <span>${item.name} x ${item.qty}</span>
                        <span>$${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="invoice-totals">
                <span>Subtotal: $${invoice.charges.subtotal.toFixed(2)}</span>
                <span>Tax: $${invoice.charges.tax.toFixed(2)}</span>
                <span class="invoice-total">Total: $${invoice.charges.total.toFixed(
                  2
                )}</span>
            </div>
            <div style="text-align: right; margin-top: 15px;">
                <button class="print-invoice" onclick="printInvoice('${
                  invoice.invoiceNumber
                }')">Print Invoice</button>
            </div>
        `;

    invoiceList.appendChild(invoiceCard);
  });
});

// Function to print a specific invoice
function printInvoice(invoiceNumber) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const invoice = currentUser.invoices.find(
    (inv) => inv.invoiceNumber === invoiceNumber
  );

  if (!invoice) return;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice ${invoice.invoiceNumber}</title>
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
                <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${new Date(
                  invoice.date
                ).toLocaleDateString()}</p>
                <p><strong>Customer:</strong> ${invoice.customerInfo.name}</p>
                <p><strong>Email:</strong> ${invoice.customerInfo.email}</p>
                <p><strong>Phone:</strong> ${invoice.customerInfo.phone}</p>
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
                    ${invoice.items
                      .map(
                        (item) => `
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
                <p>Subtotal: $${invoice.charges.subtotal.toFixed(2)}</p>
                <p>Tax: $${invoice.charges.tax.toFixed(2)}</p>
                <p><strong>Total: $${invoice.charges.total.toFixed(
                  2
                )}</strong></p>
            </div>
        </body>
        </html>
    `);

  printWindow.document.close();
  printWindow.print();
}

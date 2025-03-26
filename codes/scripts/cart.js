// Check if user is logged in
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

function updateCartDisplay() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cartItems = currentUser.cart || {};
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  // Display cart items
  let subtotal = 0;
  cartItemsContainer.innerHTML = "";

  Object.entries(cartItems).forEach(([id, item]) => {
    const row = document.createElement("tr");
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>
        <input type="number" class="quantity-input" value="${
          item.qty
        }" min="1" data-id="${id}">
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td>
        <button class="btn-secondary remove-item" data-id="${id}">Remove</button>
      </td>
    `;
    cartItemsContainer.appendChild(row);
  });

  // Calculate tax and total
  const tax = subtotal * 0.15; // 15% tax
  const total = subtotal + tax;

  // Update totals
  subtotalElement.textContent = subtotal.toFixed(2);
  taxElement.textContent = tax.toFixed(2);
  totalElement.textContent = total.toFixed(2);

  // Add event listeners for quantity updates
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      const productId = this.dataset.id;
      const newQuantity = parseInt(this.value);

      if (newQuantity < 1) {
        this.value = 1;
        currentUser.cart[productId].qty = 1;
      } else {
        currentUser.cart[productId].qty = newQuantity;
      }

      // Update user in localStorage
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

      // Refresh cart display
      updateCartDisplay();
    });
  });

  // Add event listeners for remove buttons
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.id;
      delete currentUser.cart[productId];
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

      // Refresh cart display
      updateCartDisplay();
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Initial cart display
  updateCartDisplay();

  // Handle clear cart
  document.getElementById("clear-cart").addEventListener("click", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    currentUser.cart = {};
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

    // Refresh cart display
    updateCartDisplay();
  });

  // Handle checkout
  document.getElementById("checkout").addEventListener("click", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const cartItems = currentUser.cart || {};

    if (Object.keys(cartItems).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Calculate charges
    let subtotal = 0;
    Object.values(cartItems).forEach((item) => {
      subtotal += item.price * item.qty;
    });
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    const charges = {
      subtotal: subtotal,
      tax: tax,
      total: total,
    };

    // Store cart and charges for checkout
    localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
    localStorage.setItem("charges", JSON.stringify(charges));

    // Redirect to invoice page
    window.location.href = "invoice.html";
  });
});

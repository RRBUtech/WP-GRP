// Check if user is logged in
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

function updateCartPreview() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cartItems = currentUser.cart || {};
  const cartPreviewItems = document.getElementById("cart-preview-items");
  const cartPreviewTotal = document.getElementById("cart-preview-total");

  // Clear current preview
  cartPreviewItems.innerHTML = "";
  let total = 0;

  // Add items to preview
  Object.entries(cartItems).forEach(([id, item]) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <span>${item.name} x ${item.qty}</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    cartPreviewItems.appendChild(cartItem);
  });

  // Update total
  cartPreviewTotal.textContent = total.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function () {
  // Initial cart preview update
  updateCartPreview();

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productCard = this.closest(".product-card");
      const productId = productCard.dataset.id;
      const productName = productCard.dataset.name;
      const productPrice = parseFloat(productCard.dataset.price);
      const quantity = parseInt(
        document.getElementById(`product-${productId}-qty`).value
      );

      // Get current user
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      // Initialize cart if it doesn't exist
      if (!currentUser.cart) {
        currentUser.cart = {};
      }

      // Add or update item in cart
      if (currentUser.cart[productId]) {
        currentUser.cart[productId].qty += quantity;
      } else {
        currentUser.cart[productId] = {
          name: productName,
          price: productPrice,
          qty: quantity,
        };
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

      // Update cart preview
      updateCartPreview();
      alert("Item added to cart successfully!");
    });
  });
});

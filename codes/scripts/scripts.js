const correctUsername = "admin";
const correctPassword = "password123";
let attempts = 0;

document
  .getElementById("loginForm")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (username === correctUsername && password === correctPassword) {
      window.location.href = "products.html";
    } else {
      attempts++;
      errorMessage.textContent = "Incorrect username or password!";
      if (attempts >= 3) {
        window.location.href = "error.html";
      }
    }
  });

let cart = [];
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const product = this.parentElement;
    const productName = product.dataset.name;
    const productPrice = parseFloat(product.dataset.price);

    cart.push({ name: productName, price: productPrice });
    console.log("Cart:", cart); // Log the cart to see if items are added

    updateCart();
  });
});

function updateCart() {
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    cartList.appendChild(li);
  });
}

document.getElementById("checkout")?.addEventListener("click", function () {
  console.log("Saving cart:", cart); // Log the cart before saving
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "invoice.html";
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("Current path:", window.location.pathname); // Check the full path

  // Make sure the script is only executed on the invoice page
  if (window.location.pathname.includes("invoice.html")) {
    const invoiceList = document.getElementById("invoice-items");
    const totalPrice = document.getElementById("total-price");

    // Retrieve the saved cart data from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Saved Cart:", savedCart); // Log to check if cart is correctly retrieved

    let total = 0;
    // If there are items in the cart, populate the invoice
    if (savedCart.length > 0) {
      savedCart.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price}`;
        invoiceList.appendChild(li);
        total += item.price;
      });
      totalPrice.textContent = `Total: $${total}`;
    } else {
      // If the cart is empty, display a message
      invoiceList.innerHTML = "<li>No items in your cart.</li>";
    }

    // Print Invoice functionality
    document
      .getElementById("printInvoice")
      .addEventListener("click", function () {
        window.print(); // Trigger the print dialog
      });

    // Cancel Order functionality
    document
      .getElementById("cancelOrder")
      .addEventListener("click", function () {
        localStorage.removeItem("cart"); // Clear the cart in localStorage
        window.location.href = "products.html"; // Redirect to products page
      });

    // Exit functionality
    document.getElementById("exit").addEventListener("click", function () {
      window.location.href = "index.html"; // Redirect to home page
    });
  }
});

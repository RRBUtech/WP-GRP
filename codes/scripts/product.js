// Global arrays to store cart data
let cart = [];
let products = [
  { id: 1, name: "Basic Wash", price: 50 },
  { id: 2, name: "Interior Detailing", price: 100 },
  { id: 3, name: "Exterior Detailing", price: 120 },
  { id: 4, name: "Full Detailing", price: 200 },
  { id: 5, name: "Engine Cleaning", price: 80 },
  { id: 6, name: "Headlight Restoration", price: 50 },
  { id: 7, name: "Clay Bar Treatment", price: 60 },
  { id: 8, name: "Ceramic Coating", price: 350 },
  { id: 9, name: "Paint Correction", price: 300 },
  { id: 10, name: "Upholstery Cleaning", price: 90 },
];

// Function to update cart display
// function updateCart() {
//   const cartList = document.getElementById("cart-items");
//   cartList.innerHTML = "";
//   cart.forEach((item) => {
//     const li = document.createElement("li");
//     li.textContent = `${item.name} (x${item.qty}) - $${(
//       item.price * item.qty
//     ).toFixed(2)}`;
//     cartList.appendChild(li);
//   });
// }

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  cartList.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;

    const qtyCell = document.createElement("td");
    qtyCell.textContent = `x${item.qty}`;

    const priceCell = document.createElement("td");
    priceCell.textContent = `$${item.price.toFixed(2)}`;

    const totalCell = document.createElement("td");
    const itemTotal = item.price * item.qty;
    totalCell.textContent = `$${itemTotal.toFixed(2)}`;

    row.appendChild(nameCell);
    row.appendChild(qtyCell);
    row.appendChild(priceCell);
    row.appendChild(totalCell);

    cartList.appendChild(row);

    total += itemTotal;
  });

  // Update total price
  totalPriceElement.textContent = total.toFixed(2);
}

// Function to calculate the total charges
function calculateCharges() {
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.qty;
  });

  let tax = subtotal * 0.10; // 15% tax
  let discount = subtotal >= 200 ? 5 : 0; // 20% discount for orders over $200
  let total = subtotal + tax - discount;

  return { subtotal, tax, discount, total };
}

// Add product to cart
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const product = this.parentElement;
    const productId = product.dataset.id;
    const productName = product.dataset.name;
    const productPrice = parseFloat(product.dataset.price);
    const productQty = parseInt(product.querySelector("input").value);

    const existingProductIndex = cart.findIndex(
      (item) => item.id === parseInt(productId)
    );
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].qty += productQty; // Update quantity if product already exists
    } else {
      cart.push({
        id: parseInt(productId),
        name: productName,
        price: productPrice,
        qty: productQty,
      });
    }

    updateCart(); // Update cart display
  });
});

// Checkout functionality
document.getElementById("checkout").addEventListener("click", function () {
  localStorage.setItem("cart", JSON.stringify(cart)); // Save cart to local storage
  const charges = calculateCharges();
  localStorage.setItem("charges", JSON.stringify(charges)); // Save charges data
  window.location.href = "invoice.html"; // Redirect to invoice page
});

// Cancel functionality
document.getElementById("cancelOrder").addEventListener("click", function () {
  cart = []; // Clear the cart
  updateCart(); // Update cart display
});

// Exit functionality
document.getElementById("exit").addEventListener("click", function () {
  window.location.href = "index.html"; // Redirect to home page
});

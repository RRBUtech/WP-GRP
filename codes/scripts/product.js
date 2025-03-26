// Check if user is logged in
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

// Initialize AllProducts in localStorage if not exists
if (!localStorage.getItem("AllProducts")) {
  const products = [
    {
      id: 1,
      name: "Basic Wash",
      price: 50,
      description: "Basic exterior car wash service",
      image: "basic-wash.jpg",
    },
    {
      id: 2,
      name: "Interior Detailing",
      price: 100,
      description: "Complete interior cleaning and detailing",
      image: "interior-detailing.jpg",
    },
    {
      id: 3,
      name: "Exterior Detailing",
      price: 120,
      description: "Thorough exterior cleaning and protection",
      image: "exterior-detailing.jpg",
    },
    {
      id: 4,
      name: "Full Detailing",
      price: 200,
      description: "Complete interior and exterior detailing",
      image: "full-detailing.jpg",
    },
    {
      id: 5,
      name: "Engine Cleaning",
      price: 80,
      description: "Deep cleaning of engine bay",
      image: "engine-cleaning.jpg",
    },
    {
      id: 6,
      name: "Headlight Restoration",
      price: 50,
      description: "Restore cloudy headlights to clear condition",
      image: "headlight-restoration.jpg",
    },
    {
      id: 7,
      name: "Clay Bar Treatment",
      price: 60,
      description: "Remove contaminants from paint surface",
      image: "clay-bar.jpg",
    },
    {
      id: 8,
      name: "Ceramic Coating",
      price: 350,
      description: "Long-lasting paint protection",
      image: "ceramic-coating.jpg",
    },
    {
      id: 9,
      name: "Paint Correction",
      price: 300,
      description: "Remove scratches and swirl marks",
      image: "paint-correction.jpg",
    },
    {
      id: 10,
      name: "Upholstery Cleaning",
      price: 90,
      description: "Deep clean car upholstery",
      image: "upholstery-cleaning.jpg",
    },
  ];
  localStorage.setItem("AllProducts", JSON.stringify(products));
}

// Initialize AllInvoices in localStorage if not exists
if (!localStorage.getItem("AllInvoices")) {
  localStorage.setItem("AllInvoices", JSON.stringify([]));
}

// Get current user's cart
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
let cart = currentUser.cart || {};

// Get products from localStorage
const products = JSON.parse(localStorage.getItem("AllProducts"));

// Function to update cart display
function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  cartList.innerHTML = "";

  let total = 0;

  Object.values(cart).forEach((item) => {
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

    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => removeFromCart(item.id);
    actionCell.appendChild(removeButton);

    row.appendChild(nameCell);
    row.appendChild(qtyCell);
    row.appendChild(priceCell);
    row.appendChild(totalCell);
    row.appendChild(actionCell);

    cartList.appendChild(row);

    total += itemTotal;
  });

  // Update total price
  totalPriceElement.textContent = total.toFixed(2);

  // Update user's cart in localStorage
  currentUser.cart = cart;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update user's cart in RegistrationData
  const registrationData = JSON.parse(localStorage.getItem("RegistrationData"));
  const userIndex = registrationData.findIndex(
    (user) => user.trn === currentUser.trn
  );
  if (userIndex !== -1) {
    registrationData[userIndex].cart = cart;
    localStorage.setItem("RegistrationData", JSON.stringify(registrationData));
  }
}

// Function to remove item from cart
function removeFromCart(productId) {
  delete cart[productId];
  updateCart();
}

// Function to calculate the total charges
function calculateCharges() {
  let subtotal = 0;
  Object.values(cart).forEach((item) => {
    subtotal += item.price * item.qty;
  });

  const tax = subtotal * 0.1; // 10% tax
  const discount = subtotal >= 200 ? subtotal * 0.05 : 0; // 5% discount for orders over $200
  const total = subtotal + tax - discount;

  return { subtotal, tax, discount, total };
}

// Add product to cart
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const product = this.parentElement;
    const productId = parseInt(product.dataset.id);
    const productName = product.dataset.name;
    const productPrice = parseFloat(product.dataset.price);
    const productQty = parseInt(product.querySelector("input").value);

    if (cart[productId]) {
      cart[productId].qty += productQty;
    } else {
      cart[productId] = {
        id: productId,
        name: productName,
        price: productPrice,
        qty: productQty,
      };
    }

    updateCart();
  });
});

// Checkout functionality
document.getElementById("checkout").addEventListener("click", function () {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Save cart and charges to localStorage
  const charges = calculateCharges();
  localStorage.setItem("checkoutCart", JSON.stringify(cart));
  localStorage.setItem("charges", JSON.stringify(charges));

  // Redirect to invoice page
  window.location.href = "invoice.html";
});

// Cancel functionality
document.getElementById("cancelOrder").addEventListener("click", function () {
  cart = {}; // Clear the cart
  updateCart();
});

// Exit functionality
document.getElementById("exit").addEventListener("click", function () {
  window.location.href = "index.html";
});

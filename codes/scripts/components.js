// Navbar Component
class Navbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const isLoggedIn = !!currentUser;
    const isAdmin = currentUser?.role === "admin";

    this.innerHTML = `
            <nav class="navbar">
                <div class="nav-brand">
                    <a href="index.html">Jamaica Auto Spa</a>
                </div>
                <div class="nav-links">
                    <a href="index.html">Home</a>
                    <a href="products.html">Products</a>
                    <a href="cart.html">Cart</a>
                    ${isAdmin ? '<a href="dashboard.html">Dashboard</a>' : ""}
                    ${isLoggedIn ? '<a href="profile.html">Profile</a>' : ""}
                    ${
                      isLoggedIn
                        ? `<a href="#" onclick="logout()">Logout</a>`
                        : `<a href="login.html">Login</a>`
                    }
                </div>
            </nav>
        `;
  }
}

// Footer Component
class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Contact Us</h3>
                        <p>Email: info@jamaicaautospa.com</p>
                        <p>Phone: (876) 555-0123</p>
                        <p>Address: 123 Auto Street, Kingston, Jamaica</p>
                    </div>
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <a href="index.html">Home</a>
                        <a href="products.html">Products</a>
                        <a href="cart.html">Cart</a>
                    </div>
                    <div class="footer-section">
                        <h3>Follow Us</h3>
                        <div class="social-links">
                            <a href="#">Facebook</a>
                            <a href="#">Instagram</a>
                            <a href="#">Twitter</a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} Jamaica Auto Spa. All rights reserved.</p>
                </div>
            </footer>
        `;
  }
}

// Register the components
customElements.define("nav-bar", Navbar);
customElements.define("site-footer", Footer);

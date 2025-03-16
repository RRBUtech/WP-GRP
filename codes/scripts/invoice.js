document.addEventListener('DOMContentLoaded', function() {
    // Retrieve cart items and charges from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const charges = JSON.parse(localStorage.getItem('charges')) || {};

    // Get references to the table and charges summary
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');

    // If there are no items, display a message
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="4">No items in the cart.</td></tr>';
        return;
    }

    // Display cart items in the table
    let subtotal = 0;
    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.qty).toFixed(2)}</td>
        `;
        cartItemsContainer.appendChild(row);
        subtotal += item.price * item.qty;
    });

    // Calculate and display charges
    // const tax = (charges.tax || 0) * subtotal;
    // const discount = (charges.discount || 0) * subtotal;
    // const total = subtotal + tax - discount;

    const tax = charges.tax
    const discount = charges.discount
    const total = subtotal + tax - discount;

    subtotalElement.textContent = subtotal.toFixed(2);
    taxElement.textContent = tax.toFixed(2);
    discountElement.textContent = discount.toFixed(2);
    totalElement.textContent = total.toFixed(2);

    // Handle print functionality
    document.getElementById('printInvoice').addEventListener('click', () => {
        window.print();
    });

    // Handle cancel functionality
    document.getElementById('cancelOrder').addEventListener('click', () => {
        localStorage.removeItem('cart');
        window.location.href = 'products.html'; // Redirect to products page
    });

    // Handle exit functionality
    document.getElementById('exit').addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirect to home page
    });
});

document.addEventListener('DOMContentLoaded', () => {
    if (!AuthAPI.requireLogin('login.html')) return;

    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    CartAPI.updateCartBadge();

    async function renderCart() {
        const items = await CartAPI.getCartWithDetails();
        const total = await CartAPI.getTotal();
        const count = CartAPI.getItemCount();

        if (cartCount) cartCount.textContent = count;
        if (cartTotal) cartTotal.textContent = ProductsAPI.formatPrice(total);

        if (items.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío. <a href="index.html#catalog">Explorar catálogo</a></p>';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        if (checkoutBtn) checkoutBtn.disabled = false;
        cartContainer.innerHTML = '';

        items.forEach(item => {
            const row = document.createElement('div');
            row.classList.add('cart-item');
            row.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.name}">
                <div class="cart-item-info">
                    <h3>${item.product.name}</h3>
                    <p>${item.product.priceDisplay} c/u</p>
                    <p class="cart-subtotal">Subtotal: ${ProductsAPI.formatPrice(item.subtotal)}</p>
                </div>
                <div class="cart-item-controls">
                    <label>Cantidad:</label>
                    <input type="number" min="1" max="${item.product.quantity}" value="${item.quantity}" class="cart-qty" data-id="${item.productId}">
                    <button class="btn-remove" data-id="${item.productId}">Eliminar</button>
                </div>
            `;

            row.querySelector('.cart-qty').addEventListener('change', (e) => {
                const qty = parseInt(e.target.value);
                if (qty > item.product.quantity) {
                    alert(`Solo hay ${item.product.quantity} unidades disponibles.`);
                    e.target.value = item.product.quantity;
                    CartAPI.updateQuantity(item.productId, item.product.quantity);
                } else {
                    CartAPI.updateQuantity(item.productId, qty);
                }
                renderCart();
            });

            row.querySelector('.btn-remove').addEventListener('click', () => {
                CartAPI.removeItem(item.productId);
                renderCart();
            });

            cartContainer.appendChild(row);
        });
    }

    renderCart();

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('¿Deseas vaciar el carrito?')) {
                CartAPI.clearCart();
                renderCart();
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const items = await CartAPI.getCartWithDetails();
            const total = await CartAPI.getTotal();
            const user = AuthAPI.getCurrentUser();

            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push({
                id: Date.now(),
                username: user.username,
                items: items.map(i => ({ productId: i.productId, name: i.product.name, quantity: i.quantity, subtotal: i.subtotal })),
                total,
                date: new Date().toISOString()
            });
            localStorage.setItem('orders', JSON.stringify(orders));

            CartAPI.clearCart();
            alert(`Pedido realizado exitosamente por ${ProductsAPI.formatPrice(total)}. ¡Gracias por tu compra!`);
            renderCart();
        });
    }
});

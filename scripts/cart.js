const CartAPI = {
    CART_KEY: 'cart',

    getCart() {
        return JSON.parse(localStorage.getItem(this.CART_KEY)) || [];
    },

    saveCart(cart) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
        this.updateCartBadge();
    },

    addItem(productId, quantity) {
        const cart = this.getCart();
        const existing = cart.find(item => item.productId == productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ productId: Number(productId), quantity });
        }
        this.saveCart(cart);
    },

    updateQuantity(productId, quantity) {
        let cart = this.getCart();
        if (quantity <= 0) {
            cart = cart.filter(item => item.productId != productId);
        } else {
            const item = cart.find(i => i.productId == productId);
            if (item) item.quantity = quantity;
        }
        this.saveCart(cart);
    },

    removeItem(productId) {
        const cart = this.getCart().filter(item => item.productId != productId);
        this.saveCart(cart);
    },

    clearCart() {
        localStorage.removeItem(this.CART_KEY);
        this.updateCartBadge();
    },

    getItemCount() {
        return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
    },

    async getCartWithDetails() {
        const cart = this.getCart();
        const products = await ProductsAPI.getProducts();
        return cart.map(item => {
            const product = products.find(p => p.id == item.productId);
            if (!product) return null;
            return {
                ...item,
                product,
                subtotal: product.price * item.quantity
            };
        }).filter(Boolean);
    },

    async getTotal() {
        const items = await this.getCartWithDetails();
        return items.reduce((sum, item) => sum + item.subtotal, 0);
    },

    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.getItemCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }
};

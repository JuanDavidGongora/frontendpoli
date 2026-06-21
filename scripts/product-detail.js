document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.querySelector('.product-detail-container').innerHTML = '<p>No se especificó el artículo.</p>';
        return;
    }

    CartAPI.updateCartBadge();

    ProductsAPI.getProductById(productId).then(product => {
        if (!product) {
            document.querySelector('.product-detail-container').innerHTML = '<p>Artículo no encontrado.</p>';
            return;
        }

        document.getElementById('product-image').src = product.image;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = product.priceDisplay;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-quantity').textContent = `Stock disponible: ${product.quantity} unidades`;
        document.getElementById('product-category').textContent = `Categoría: ${product.category} | Marca: ${product.brand}`;
        document.getElementById('product-promotion').textContent = product.promotion ? 'En promoción' : '';
        document.getElementById('product-characteristics').innerHTML =
            ProductsAPI.renderCharacteristics(product.characteristics);

        const qtyInput = document.getElementById('purchase-qty');
        qtyInput.max = product.quantity;

        document.getElementById('product-image').addEventListener('click', () => {
            document.getElementById('product-description').classList.toggle('expanded');
        });

        document.getElementById('btn-add-cart').addEventListener('click', () => {
            if (!AuthAPI.isLoggedIn()) {
                alert('Debes iniciar sesión para agregar artículos al carrito.');
                window.location.href = 'login.html';
                return;
            }
            let qty = parseInt(qtyInput.value) || 1;
            if (qty > product.quantity) qty = product.quantity;
            CartAPI.addItem(product.id, qty);
            alert(`"${product.name}" agregado al carrito.`);
        });

        document.getElementById('btn-buy-now').addEventListener('click', () => {
            if (!AuthAPI.isLoggedIn()) {
                alert('Debes estar registrado e iniciar sesión para realizar un pedido.');
                window.location.href = 'login.html';
                return;
            }
            let qty = parseInt(qtyInput.value) || 1;
            if (qty > product.quantity) qty = product.quantity;
            CartAPI.addItem(product.id, qty);
            window.location.href = 'cart.html';
        });
    });
});

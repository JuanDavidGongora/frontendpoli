document.addEventListener('DOMContentLoaded', () => {
    if (!AuthAPI.isAdmin()) {
        alert('Acceso restringido. Inicia sesión como administrador.');
        window.location.href = 'login.html';
        return;
    }

    function getProducts() {
        return ProductsAPI.getProducts();
    }

    function renderProducts(products) {
        const list = document.getElementById('services-list');
        list.innerHTML = '';
        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-card admin-card';
            div.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.priceDisplay}</p>
                <p>Stock: ${product.quantity}</p>
                <button class="btn-remove delete-btn" data-id="${product.id}">Eliminar</button>
            `;
            list.appendChild(div);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                getProducts().then(products => {
                    const updated = products.filter(p => p.id != id);
                    ProductsAPI.saveProducts(updated);
                    renderProducts(updated);
                });
            });
        });
    }

    const form = document.getElementById('add-service-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('service-name').value;
        const priceStr = document.getElementById('service-price').value.replace(/\D/g, '');
        const price = parseInt(priceStr) || 0;
        const description = document.getElementById('service-description').value;
        const category = document.getElementById('service-category').value || 'General';
        const brand = document.getElementById('service-brand').value || 'TechGamers';
        const quantity = parseInt(document.getElementById('service-quantity').value) || 1;
        const imageInput = document.getElementById('service-image');
        const file = imageInput.files[0];

        let image = 'images/products/default.jpg';
        if (file) {
            image = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        const products = await getProducts();
        products.push({
            id: Date.now(),
            name,
            price,
            priceDisplay: ProductsAPI.formatPrice(price),
            image,
            description,
            quantity,
            promotion: false,
            category,
            brand,
            characteristics: {}
        });
        ProductsAPI.saveProducts(products);
        renderProducts(products);
        form.reset();
        alert('Artículo añadido correctamente');
    });

    getProducts().then(renderProducts);

    document.getElementById('go-home-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

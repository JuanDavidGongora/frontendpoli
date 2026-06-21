document.addEventListener('DOMContentLoaded', () => {
    const catalogList = document.getElementById('catalog-list');
    if (!catalogList) return;

    let allProducts = [];
    const userSession = document.getElementById('user-session');
    const searchBasic = document.getElementById('search-basic');
    const searchBtn = document.getElementById('search-btn');
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedPanel = document.getElementById('advanced-search-panel');
    const applyAdvancedBtn = document.getElementById('apply-advanced');
    const clearAdvancedBtn = document.getElementById('clear-advanced');
    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');

    updateUserNav();
    CartAPI.updateCartBadge();

    ProductsAPI.getProducts().then(products => {
        allProducts = products;
        populateAdvancedFilters(products);
        renderCatalog(products);
    });

    function updateUserNav() {
        if (!userSession) return;
        const user = AuthAPI.getCurrentUser();
        if (user) {
            userSession.innerHTML = `
                <span class="user-greeting">Hola, ${user.username}</span>
                <a href="#" id="logout-link">Cerrar sesión</a>
            `;
            document.getElementById('logout-link').addEventListener('click', (e) => {
                e.preventDefault();
                AuthAPI.logout();
                window.location.reload();
            });
        } else {
            userSession.innerHTML = `<a href="login.html">Iniciar sesión</a> | <a href="register.html">Registrarse</a>`;
        }
    }

    function populateAdvancedFilters(products) {
        const categorySelect = document.getElementById('filter-category');
        const brandSelect = document.getElementById('filter-brand');
        if (!categorySelect || !brandSelect) return;

        ProductsAPI.getCategories(products).forEach(cat => {
            categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
        ProductsAPI.getBrands(products).forEach(brand => {
            brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
        });
    }

    function renderCatalog(products) {
        catalogList.innerHTML = '';
        if (products.length === 0) {
            catalogList.innerHTML = '<p class="no-results">No se encontraron artículos con los criterios seleccionados.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            const promoBadge = product.promotion ? '<span class="promo-badge">Promoción</span>' : '';
            const chars = product.characteristics
                ? Object.entries(product.characteristics).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' | ')
                : '';

            card.innerHTML = `
                ${promoBadge}
                <img src="${product.image}" alt="${product.name}" class="product-image" data-id="${product.id}">
                <h3>${product.name}</h3>
                <p class="product-price">${product.priceDisplay}</p>
                <p class="product-stock">Stock: ${product.quantity} unidades</p>
                <p class="product-chars">${chars}</p>
                <div class="product-actions">
                    <input type="number" min="1" max="${product.quantity}" value="1" class="qty-input" id="qty-${product.id}">
                    <button class="btn-buy" data-id="${product.id}">Comprar</button>
                    <button class="btn-add-cart" data-id="${product.id}">Al carrito</button>
                </div>
            `;

            card.querySelector('.product-image').addEventListener('click', () => openModal(product));
            card.querySelector('.btn-buy').addEventListener('click', () => handlePurchase(product.id));
            card.querySelector('.btn-add-cart').addEventListener('click', () => handleAddToCart(product.id));

            catalogList.appendChild(card);
        });
    }

    function openModal(product) {
        document.getElementById('modal-image').src = product.image;
        document.getElementById('modal-name').textContent = product.name;
        document.getElementById('modal-price').textContent = product.priceDisplay;
        document.getElementById('modal-stock').textContent = `Stock disponible: ${product.quantity} unidades`;
        document.getElementById('modal-description').textContent = product.description;
        document.getElementById('modal-category').textContent = `Categoría: ${product.category} | Marca: ${product.brand}`;
        document.getElementById('modal-promotion').textContent = product.promotion ? 'En promoción' : '';
        document.getElementById('modal-characteristics').innerHTML =
            ProductsAPI.renderCharacteristics(product.characteristics);
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    function getQuantity(productId, maxStock) {
        const input = document.getElementById(`qty-${productId}`);
        let qty = parseInt(input?.value) || 1;
        if (qty < 1) qty = 1;
        if (qty > maxStock) {
            alert(`Solo hay ${maxStock} unidades disponibles.`);
            qty = maxStock;
            if (input) input.value = maxStock;
        }
        return qty;
    }

    function handleAddToCart(productId) {
        if (!AuthAPI.isLoggedIn()) {
            alert('Debes iniciar sesión para agregar artículos al carrito.');
            window.location.href = 'login.html';
            return;
        }
        const product = allProducts.find(p => p.id == productId);
        if (!product) return;
        const qty = getQuantity(productId, product.quantity);
        CartAPI.addItem(productId, qty);
        alert(`${qty} x "${product.name}" agregado al carrito.`);
    }

    function handlePurchase(productId) {
        if (!AuthAPI.isLoggedIn()) {
            alert('Debes estar registrado e iniciar sesión para realizar un pedido.');
            window.location.href = 'login.html';
            return;
        }
        const product = allProducts.find(p => p.id == productId);
        if (!product) return;
        const qty = getQuantity(productId, product.quantity);
        CartAPI.addItem(productId, qty);
        window.location.href = 'cart.html';
    }

    function applyFilters() {
        let filtered = ProductsAPI.searchByName(allProducts, searchBasic?.value || '');
        const filters = {
            category: document.getElementById('filter-category')?.value || '',
            brand: document.getElementById('filter-brand')?.value || '',
            promotion: document.getElementById('filter-promotion')?.value || '',
            minPrice: document.getElementById('filter-min-price')?.value || '',
            maxPrice: document.getElementById('filter-max-price')?.value || '',
            minStock: document.getElementById('filter-min-stock')?.value || '',
            characteristicKey: document.getElementById('filter-char-key')?.value || '',
            characteristicValue: document.getElementById('filter-char-value')?.value || ''
        };
        filtered = ProductsAPI.advancedSearch(filtered, filters);
        renderCatalog(filtered);
    }

    if (searchBtn) searchBtn.addEventListener('click', applyFilters);
    if (searchBasic) searchBasic.addEventListener('keyup', (e) => { if (e.key === 'Enter') applyFilters(); });
    if (applyAdvancedBtn) applyAdvancedBtn.addEventListener('click', applyFilters);
    if (clearAdvancedBtn) clearAdvancedBtn.addEventListener('click', () => {
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-brand').value = '';
        document.getElementById('filter-promotion').value = '';
        document.getElementById('filter-min-price').value = '';
        document.getElementById('filter-max-price').value = '';
        document.getElementById('filter-min-stock').value = '';
        document.getElementById('filter-char-key').value = '';
        document.getElementById('filter-char-value').value = '';
        if (searchBasic) searchBasic.value = '';
        renderCatalog(allProducts);
    });
    if (advancedToggle) advancedToggle.addEventListener('click', () => {
        advancedPanel.classList.toggle('open');
    });

    // Slider
    let currentIndex = 0;
    const sliderImages = document.querySelectorAll('.slider img');
    function showSlide(index) {
        sliderImages.forEach((img, i) => img.classList.toggle('active', i === index));
    }
    if (sliderImages.length > 0) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % sliderImages.length;
            showSlide(currentIndex);
        }, 3000);
        showSlide(currentIndex);
    }
});

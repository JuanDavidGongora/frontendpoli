const ProductsAPI = {
    STORAGE_KEY: 'products',
    DATA_VERSION: '3',

    getProducts() {
        const version = localStorage.getItem('products_version');
        const local = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
        if (version === this.DATA_VERSION && local && Array.isArray(local) && local.length >= 20) {
            return Promise.resolve(local);
        }
        localStorage.removeItem(this.STORAGE_KEY);
        return fetch('data/products.json')
            .then(res => res.json())
            .then(data => {
                const products = data.products || [];
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
                localStorage.setItem('products_version', this.DATA_VERSION);
                return products;
            });
    },

    getProductById(id) {
        return this.getProducts().then(products =>
            products.find(p => p.id == id)
        );
    },

    saveProducts(products) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    },

    formatPrice(price) {
        return '$' + price.toLocaleString('es-CO');
    },

    getCategories(products) {
        return [...new Set(products.map(p => p.category))].sort();
    },

    getBrands(products) {
        return [...new Set(products.map(p => p.brand))].sort();
    },

    searchByName(products, query) {
        if (!query.trim()) return products;
        const term = query.toLowerCase().trim();
        return products.filter(p => p.name.toLowerCase().includes(term));
    },

    advancedSearch(products, filters) {
        return products.filter(p => {
            if (filters.category && p.category !== filters.category) return false;
            if (filters.brand && p.brand !== filters.brand) return false;
            if (filters.promotion === 'true' && !p.promotion) return false;
            if (filters.promotion === 'false' && p.promotion) return false;
            if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
            if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
            if (filters.minStock && p.quantity < Number(filters.minStock)) return false;
            if (filters.characteristicKey && filters.characteristicValue) {
                const chars = p.characteristics || {};
                const val = chars[filters.characteristicKey];
                if (!val || !val.toLowerCase().includes(filters.characteristicValue.toLowerCase())) return false;
            }
            return true;
        });
    },

    renderCharacteristics(characteristics) {
        if (!characteristics) return '';
        return Object.entries(characteristics)
            .map(([key, val]) => `<li><strong>${key}:</strong> ${val}</li>`)
            .join('');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Obtener servicios de localStorage o JSON
    function getServices() {
        const local = JSON.parse(localStorage.getItem('services'));
        if (local && Array.isArray(local)) return Promise.resolve(local);
        return fetch('data/services.json')
            .then(res => res.json())
            .then(data => data.services || []);
    }

    // Mostrar servicios en el inicio
    const servicesList = document.querySelector('.services-list');
    if (servicesList) {
        getServices().then(services => {
            services.forEach(service => {
                const serviceItem = document.createElement('div');
                serviceItem.classList.add('service-item');
                serviceItem.innerHTML = `
                    <img src="${service.image}" alt="${service.name}">
                    <h3>${service.name}</h3>
                    <p>${service.price}</p>
                `;
                serviceItem.addEventListener('click', () => {
                    window.location.href = `service-detail.html?id=${service.id}`;
                });
                servicesList.appendChild(serviceItem);
            });
        });
    }

    // Manejar el formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (verifyCredentials(username, password)) {
                window.location.href = 'admin.html';
            } else {
                alert('Credenciales incorrectas');
            }
        });
    }

    // Manejar el botón de crear cuenta
    const createAccountBtn = document.getElementById('create-account-btn');
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', () => {
            const username = prompt('Introduce un nombre de usuario:');
            const password = prompt('Introduce una contraseña:');
            if (username && password) {
                createAccount(username, password);
                alert('Cuenta creada exitosamente');
            }
        });
    }

    // Función para verificar credenciales
    function verifyCredentials(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.username === username && user.password === password);
    }

    // Función para crear una cuenta
    function createAccount(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Slider
    let currentIndex = 0;
    const sliderImages = document.querySelectorAll('.slider img');
    function showSlide(index) {
        sliderImages.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }
    if (sliderImages.length > 0) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % sliderImages.length;
            showSlide(currentIndex);
        }, 3000);
        showSlide(currentIndex);
    }
});
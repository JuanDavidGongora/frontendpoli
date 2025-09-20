document.addEventListener('DOMContentLoaded', () => {
    // Cargar servicios desde el archivo JSON
    fetch('data/services.json')
        .then(response => response.json())
        .then(data => {
            const servicesList = document.querySelector('.services-list');
            data.services.forEach(service => {
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

    // Manejar el formulario de login
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        // Verificar las credenciales
        if (verifyCredentials(username, password)) {
            window.location.href = 'admin.html'; // Redirige a la página de administración
        } else {
            alert('Credenciales incorrectas');
        }
    });

    // Manejar el botón de crear cuenta
    const createAccountBtn = document.getElementById('create-account-btn');
    createAccountBtn.addEventListener('click', () => {
        const username = prompt('Introduce un nombre de usuario:');
        const password = prompt('Introduce una contraseña:');
        if (username && password) {
            createAccount(username, password);
            alert('Cuenta creada exitosamente');
        }
    });

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
    setInterval(() => {
        currentIndex = (currentIndex + 1) % sliderImages.length;
        showSlide(currentIndex);
    }, 3000);
    showSlide(currentIndex);

 // Cargar detalles del servicio
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    if (serviceId) {
        fetch('data/services.json')
            .then(response => response.json())
            .then(data => {
                const service = data.services.find(s => s.id == serviceId);
                if (service) {
                    document.getElementById('service-image').src = service.image;
                    document.getElementById('service-name').textContent = service.name;
                    document.getElementById('service-price').textContent = `Precio: ${service.price}`;
                    document.getElementById('service-description').textContent = `Descripción: ${service.description}`;
                    document.getElementById('service-quantity').textContent = `Cantidad Disponible: ${service.quantity}`;
                    document.getElementById('service-promotion').textContent = service.promotion ? 'En Promoción' : 'No en Promoción';
                }
            });
    }
});



let current = 0;
const images = document.querySelectorAll('.slider img');

function showImage(index) {
    images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
}

function nextImage() {
    current = (current + 1) % images.length;
    showImage(current);
}

if (images.length > 0) {
    showImage(current);
    setInterval(nextImage, 3000); // Cambia cada 3 segundos
}
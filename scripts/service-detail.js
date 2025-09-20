document.addEventListener('DOMContentLoaded', () => {
    const addServiceForm = document.getElementById('add-service-form');
    const servicesList = document.getElementById('services-list');

    addServiceForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const serviceName = document.getElementById('service-name').value;
        const servicePrice = document.getElementById('service-price').value;
        const serviceImage = document.getElementById('service-image').files[0];
        const serviceDescription = document.getElementById('service-description').value;

        if (serviceImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const serviceItem = document.createElement('div');
                serviceItem.classList.add('service-item');
                serviceItem.innerHTML = `
                    <img src="${e.target.result}" alt="${serviceName}">
                    <h3>${serviceName}</h3>
                    <p>${servicePrice}</p>
                    <p>${serviceDescription}</p>
                `;
                servicesList.appendChild(serviceItem);

                // Guardar el servicio en el localStorage
                const services = JSON.parse(localStorage.getItem('services')) || [];
                services.push({
                    name: serviceName,
                    price: servicePrice,
                    image: e.target.result,
                    description: serviceDescription
                });
                localStorage.setItem('services', JSON.stringify(services));

                // Actualizar la página de inicio
                updateHomePage();
            };
            reader.readAsDataURL(serviceImage);
        }

        addServiceForm.reset();
    });

    // Función para actualizar la página de inicio
    function updateHomePage() {
        const services = JSON.parse(localStorage.getItem('services')) || [];
        const homeServicesList = document.getElementById('services-list');
        homeServicesList.innerHTML = ''; // Limpiar la lista de servicios

        services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('service-item');
            serviceItem.innerHTML = `
                <img src="${service.image}" alt="${service.name}">
                <h3>${service.name}</h3>
                <p>${service.price}</p>
                <p>${service.description}</p>
            `;
            homeServicesList.appendChild(serviceItem);
        });
    }

    // Cargar los servicios al cargar la página
    updateHomePage();

    // Manejar el formulario de login
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        // Verificar las credenciales
        if (verifyCredentials(username, password)) {
            window.location.href = 'admin.html';
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
                } else {
                    document.querySelector('.service-detail-container').textContent = 'Servicio no encontrado.';
                }
            })
            .catch(() => {
                document.querySelector('.service-detail-container').textContent = 'Error al cargar los datos.';
            });
    } else {
        document.querySelector('.service-detail-container').textContent = 'No se especificó el servicio.';
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
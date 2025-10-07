document.addEventListener('DOMContentLoaded', () => {
    // Obtener servicios de localStorage o JSON
    function getServices() {
        const local = JSON.parse(localStorage.getItem('services'));
        if (local && Array.isArray(local)) return Promise.resolve(local);
        return fetch('data/services.json')
            .then(res => res.json())
            .then(data => data.services || []);
    }

    // Mostrar servicios en el panel con botón eliminar
    function renderServices(services) {
        const list = document.getElementById('services-list');
        list.innerHTML = '';
        services.forEach(service => {
            const div = document.createElement('div');
            div.className = 'service-item';
            div.innerHTML = `
                <img src="${service.image}" alt="${service.name}">
                <h3>${service.name}</h3>
                <p>${service.price}</p>
                <button class="delete-btn" data-id="${service.id}">Eliminar</button>
            `;
            list.appendChild(div);
        });

        // Asignar evento a los botones de eliminar
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                let services = JSON.parse(localStorage.getItem('services')) || [];
                services = services.filter(s => s.id != id);
                localStorage.setItem('services', JSON.stringify(services));
                renderServices(services);
            });
        });
    }

    // Manejar el formulario de agregar servicio
    const form = document.getElementById('add-service-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('service-name').value;
        const price = document.getElementById('service-price').value;
        const description = document.getElementById('service-description').value;
        const imageInput = document.getElementById('service-image');
        const file = imageInput.files[0];

        // Convertir imagen a base64
        let image = '';
        if (file) {
            image = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        let services = JSON.parse(localStorage.getItem('services')) || [];
        const id = Date.now(); // ID único
        services.push({
            id,
            name,
            price,
            image,
            description,
            quantity: 1,
            promotion: false
        });
        localStorage.setItem('services', JSON.stringify(services));
        renderServices(services);
        form.reset();
        alert('Servicio añadido correctamente');
    });

    // Inicializar lista de servicios
    getServices().then(services => {
        // Si es la primera vez, guarda los servicios iniciales en localStorage
        if (!localStorage.getItem('services')) {
            localStorage.setItem('services', JSON.stringify(services));
        }
        renderServices(services);
    });

    // Botón para ir a inicio
    const goHomeBtn = document.getElementById('go-home-btn');
    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});
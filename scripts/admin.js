document.addEventListener('DOMContentLoaded', () => {
    const serviceForm = document.getElementById('service-form');
    const servicesTable = document.getElementById('services-table');

    // Cargar servicios desde el archivo JSON
    fetch('data/services.json')
        .then(response => response.json())
        .then(data => {
            data.services.forEach(service => {
                addServiceToTable(service);
            });
        });

    // Manejar el formulario de añadir servicio
    serviceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('service-name').value;
        const price = document.getElementById('service-price').value;
        const image = document.getElementById('service-image').value;
        const description = document.getElementById('service-description').value;
        const quantity = document.getElementById('service-quantity').value;
        const promotion = document.getElementById('service-promotion').checked;

        const newService = {
            id: Date.now(),
            name,
            price,
            image,
            description,
            quantity,
            promotion
        };

        addServiceToTable(newService);

        // Actualizar el archivo JSON
        fetch('data/services.json')
            .then(response => response.json())
            .then(data => {
                data.services.push(newService);
                return fetch('data/services.json', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            });

        serviceForm.reset();
    });

    function addServiceToTable(service) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.name}</td>
            <td>${service.price}</td>
            <td><img src="${service.image}" alt="${service.name}" width="50"></td>
            <td>${service.description}</td>
            <td>${service.quantity}</td>
            <td>${service.promotion ? 'Sí' : 'No'}</td>
            <td><button onclick="deleteService(${service.id})">Eliminar</button></td>
        `;
        servicesTable.appendChild(row);
    }

    window.deleteService = function(id) {
        fetch('data/services.json')
            .then(response => response.json())
            .then(data => {
                data.services = data.services.filter(service => service.id != id);
                return fetch('data/services.json', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })
            .then(() => {
                location.reload();
            });
    };
});
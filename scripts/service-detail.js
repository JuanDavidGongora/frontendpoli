document.addEventListener('DOMContentLoaded', () => {
    function getServices() {
        const local = JSON.parse(localStorage.getItem('services'));
        if (local && Array.isArray(local)) return Promise.resolve(local);
        return fetch('data/services.json')
            .then(res => res.json())
            .then(data => data.services || []);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    if (serviceId) {
        getServices().then(services => {
            const service = services.find(s => s.id == serviceId);
            if (service) {
                document.getElementById('service-image').src = service.image;
                document.getElementById('service-name').textContent = service.name;
                document.getElementById('service-price').textContent = `Precio: ${service.price}`;
                document.getElementById('service-description').textContent = `Descripción: ${service.description}`;
                document.getElementById('service-quantity').textContent = `Cantidad Disponible: ${service.quantity ?? ''}`;
                document.getElementById('service-promotion').textContent = service.promotion ? 'En Promoción' : 'No en Promoción';
            } else {
                document.querySelector('.service-detail-container').textContent = 'Servicio no encontrado.';
            }
        }).catch(() => {
            document.querySelector('.service-detail-container').textContent = 'Error al cargar los datos.';
        });
    } else {
        document.querySelector('.service-detail-container').textContent = 'No se especificó el servicio.';
    }
});
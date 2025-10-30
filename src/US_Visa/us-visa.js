// Funcionalidad para los botones
document.querySelectorAll('.service-btn').forEach(button => {
    button.addEventListener('click', () => {
        alert('¡Gracias por tu interés! Esta es una demostración para un proyecto escolar.');
    });
});

document.querySelector('.btn').addEventListener('click', () => {
    alert('¡Gracias por tu interés en contactarnos! Esta es una demostración para un proyecto escolar.');
});

// Funcionalidad para las opciones de viaje
document.querySelectorAll('.travel-reason').forEach(reason => {
    reason.addEventListener('click', () => {
        const checkbox = reason.querySelector('input');
        checkbox.checked = !checkbox.checked;
        reason.classList.toggle('selected', checkbox.checked);
    });
});

// Funcionalidad para el formulario principal
document.querySelector('.form-btn').addEventListener('click', () => {
    const citizenship = document.getElementById('citizenship');
    const selectedOption = citizenship.options[citizenship.selectedIndex];
    
    if (!selectedOption.value) {
        alert('Por favor selecciona tu nacionalidad.');
        return;
    }
    
    const selectedReasons = Array.from(document.querySelectorAll('.travel-reason input:checked'))
        .map(checkbox => {
            const reason = checkbox.closest('.travel-reason');
            return reason.querySelector('.reason-label').textContent;
        })
        .join(', ');
    
    if (!selectedReasons) {
        alert('Por favor selecciona al menos una razón de viaje.');
        return;
    }
    
    const multipleCitizenship = document.getElementById('multiple-citizenship').checked;
    
    alert(`¡Perfecto! 
Nacionalidad: ${selectedOption.text}
${multipleCitizenship ? 'Tienes múltiples nacionalidades' : ''}
Razones de viaje: ${selectedReasons}
Esta es una demostración para un proyecto escolar.`);
});

// Mejora de accesibilidad: focus visible para elementos interactivos
document.addEventListener('DOMContentLoaded', function() {
    // Agregar soporte para focus visible
    const style = document.createElement('style');
    style.textContent = `
        .form-btn:focus,
        .service-btn:focus,
        .btn:focus,
        .travel-reason:focus {
            outline: 3px solid #0067FF;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
});

// Mejora de SEO: agregar meta description dinámica si es necesario
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que la meta description esté presente
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = 'Servicios expertos de visa para Estados Unidos. Asistencia para visas de turismo, negocios, estudio y tránsito con alta tasa de aprobación.';
        document.head.appendChild(metaDescription);
    }
});
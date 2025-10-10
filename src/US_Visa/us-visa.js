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
    const citizenship = document.getElementById('citizenship').value;
    if (!citizenship) {
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
Nacionalidad: ${document.getElementById('citizenship').options[document.getElementById('citizenship').selectedIndex].text}
${multipleCitizenship ? 'Tienes múltiples nacionalidades' : ''}
Razones de viaje: ${selectedReasons}
Esta es una demostración para un proyecto escolar.`);
});
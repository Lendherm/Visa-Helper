// Funcionalidad mejorada para US Visa con accesibilidad completa
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar anunciador ARIA
    createAriaAnnouncer();
    
    // Agregar roles ARIA dinámicamente
    document.querySelector('main').setAttribute('role', 'main');
    document.querySelector('header').setAttribute('role', 'banner');
    document.querySelector('footer').setAttribute('role', 'contentinfo');

    // Funcionalidad para los botones de servicio
    document.querySelectorAll('.service-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const service = button.getAttribute('data-service');
            const serviceName = getServiceName(service);
            
            announceToScreenReader(`Iniciando proceso para el servicio: ${serviceName}`);
            
            // Simular proceso de inicio
            showServiceModal(serviceName);
        });
        
        // Soporte para teclado
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Funcionalidad para el botón de contacto
    const contactBtn = document.querySelector('.btn[href="/PortalVisaHelper/index.html"]');
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            announceToScreenReader('Redirigiendo al portal de ingreso');
            // En un entorno real, aquí iría la redirección
            setTimeout(() => {
                alert('¡Gracias por tu interés! Esta es una demostración para un proyecto escolar. En una aplicación real, te redirigiríamos al portal.');
            }, 100);
        });
    }

    // Funcionalidad mejorada para las opciones de viaje
    document.querySelectorAll('.travel-reason').forEach(reason => {
        const checkbox = reason.querySelector('input');
        const label = reason.querySelector('.reason-label').textContent;
        
        // Actualizar estado ARIA inicial
        reason.setAttribute('aria-checked', 'false');
        
        reason.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTravelReason(reason, checkbox, label);
        });

        // Soporte para teclado
        reason.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTravelReason(reason, checkbox, label);
            }
        });
    });

    // Funcionalidad para el formulario principal
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', processForm);
        
        // Permitir enviar formulario con Enter en los selects
        document.getElementById('citizenship').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                processForm();
            }
        });
    }

    // Validación en tiempo real para el formulario
    const citizenshipSelect = document.getElementById('citizenship');
    if (citizenshipSelect) {
        citizenshipSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value) {
                this.setAttribute('aria-invalid', 'false');
                announceToScreenReader(`Nacionalidad seleccionada: ${selectedOption.text}`);
            }
        });
    }

    // Mejorar accesibilidad del checkbox de múltiples nacionalidades
    const multipleCitizenship = document.getElementById('multiple-citizenship');
    if (multipleCitizenship) {
        multipleCitizenship.addEventListener('change', function() {
            const status = this.checked ? 'activado' : 'desactivado';
            announceToScreenReader(`Opción de múltiples nacionalidades ${status}`);
        });
    }
});

// Función para alternar opciones de viaje
function toggleTravelReason(reason, checkbox, label) {
    checkbox.checked = !checkbox.checked;
    reason.classList.toggle('selected', checkbox.checked);
    reason.setAttribute('aria-checked', checkbox.checked.toString());
    
    const status = checkbox.checked ? 'seleccionado' : 'deseleccionado';
    announceToScreenReader(`${label} ${status}`);
}

// Función para procesar el formulario principal
function processForm() {
    const citizenship = document.getElementById('citizenship');
    const selectedOption = citizenship.options[citizenship.selectedIndex];
    
    // Validación
    if (!selectedOption.value) {
        citizenship.setAttribute('aria-invalid', 'true');
        citizenship.focus();
        announceToScreenReader('Error: Por favor selecciona tu nacionalidad');
        showError('Por favor selecciona tu nacionalidad.');
        return;
    }
    
    const selectedReasons = Array.from(document.querySelectorAll('.travel-reason input:checked'))
        .map(checkbox => {
            const reason = checkbox.closest('.travel-reason');
            return reason.querySelector('.reason-label').textContent;
        });
    
    if (selectedReasons.length === 0) {
        announceToScreenReader('Error: Por favor selecciona al menos una razón de viaje');
        showError('Por favor selecciona al menos una razón de viaje.');
        return;
    }
    
    const multipleCitizenship = document.getElementById('multiple-citizenship').checked;
    
    // Mostrar resumen
    const reasonsText = selectedReasons.join(', ');
    const message = `¡Perfecto! 
Nacionalidad: ${selectedOption.text}
${multipleCitizenship ? 'Tienes múltiples nacionalidades' : 'Una nacionalidad'}
Razones de viaje: ${reasonsText}

Esta es una demostración para un proyecto escolar.`;

    announceToScreenReader('Formulario completado correctamente. Mostrando resumen.');
    showSuccessModal(message);
}

// Función para crear anunciador ARIA
function createAriaAnnouncer() {
    if (!document.getElementById('aria-announcer')) {
        const announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'visually-hidden';
        document.body.appendChild(announcer);
    }
}

// Función para anunciar mensajes a lectores de pantalla
function announceToScreenReader(message) {
    const announcer = document.getElementById('aria-announcer');
    if (announcer) {
        // Limpiar y establecer nuevo mensaje
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }
}

// Función para obtener nombre del servicio
function getServiceName(service) {
    const services = {
        'esta': 'U.S. ESTA',
        'visa': 'Servicio de Visa para EE.UU.',
        'vip': 'Visa VIP para EE.UU.'
    };
    return services[service] || 'Servicio';
}

// Función para mostrar modal de servicio
function showServiceModal(serviceName) {
    const message = `¡Gracias por tu interés en nuestro servicio ${serviceName}! 
    
Esta es una demostración para un proyecto escolar. En una aplicación real, aquí comenzaría el proceso de solicitud.`;

    // En un entorno real, aquí mostrarías un modal elegante
    // Por ahora usamos alert para simplicidad
    alert(message);
}

// Función para mostrar error
function showError(message) {
    // En un entorno real, mostrarías esto en la interfaz
    // Por ahora usamos alert para simplicidad
    alert(`❌ ${message}`);
}

// Función para mostrar éxito
function showSuccessModal(message) {
    // En un entorno real, mostrarías un modal de éxito
    // Por ahora usamos alert para simplicidad
    alert(`✅ ${message}`);
}

// Mejorar SEO: agregar meta description dinámica si es necesario
if (!document.querySelector('meta[name="description"]')) {
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Servicios expertos de visa para Estados Unidos. Asistencia para visas de turismo, negocios, estudio y tránsito con alta tasa de aprobación.';
    document.head.appendChild(metaDescription);
}

// Soporte para navegación por teclado mejorada
document.addEventListener('keydown', function(e) {
    // Atajos de teclado para navegación
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('main').focus();
                announceToScreenReader('Navegado al contenido principal');
                break;
            case '2':
                e.preventDefault();
                document.querySelector('.services h2').focus();
                announceToScreenReader('Navegado a la sección de servicios');
                break;
            case '0':
                e.preventDefault();
                document.querySelector('footer').focus();
                announceToScreenReader('Navegado al pie de página');
                break;
        }
    }
});

// Mejoras de rendimiento: carga diferida para imágenes
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Exportar funciones para pruebas (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTravelReason,
        processForm,
        announceToScreenReader
    };
}
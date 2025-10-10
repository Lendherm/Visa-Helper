// Funcionalidad para las preguntas frecuentes
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
        
        // Cambiar el símbolo
        const symbol = question.querySelector('span');
        symbol.textContent = item.classList.contains('active') ? '-' : '+';
    });
});

// Funcionalidad para los botones
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (event) => {
        // Si es el botón "Comenzar Ahora" en la sección hero
        if (button.textContent.trim() === 'Comenzar Ahora' && 
            button.closest('.hero')) {
            window.location.href = './US_Visa/US_Visa.html';
            return;
        }
        
        // Si es el botón "Ingresar" en el header
        if (button.textContent.trim() === 'Ingresar') {
            window.location.href = './PortalVisaHelper/index.html';
            return;
        }
        
        // Para todos los demás botones, mostrar alerta genérica
        alert('¡Gracias por tu interés! Esta es una demostración para un proyecto escolar.');
        event.preventDefault();
    });
});

// Smooth scroll para los enlaces de navegación
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // ✅ Cerrar menú hamburguesa al hacer click en un enlace
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Toggle menú hamburguesa
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active'); // Para animación si quieres
});

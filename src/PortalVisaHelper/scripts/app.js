import { CalendarService } from "./api-service.js";

// ===== APLICACIÓN PRINCIPAL =====

class VisaHelperApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.userProgress = {
            forms: 2,
            documents: 3,
            appointments: 1,
            overall: 25
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.renderDashboard();
        this.loadDocuments();
        this.setupAppointments();
    }

    setupEventListeners() {
        // Navegación del menú lateral
        document.querySelectorAll('.side-menu a[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('a').getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Botón de iniciar proceso
        document.getElementById('start-process').addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToSection('forms');
        });

        // 🔥 NUEVO: Botón de traducción de página
        const translateBtn = document.getElementById('translate-page-btn');
        if (translateBtn) {
            translateBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await PageTranslator.togglePageTranslation();
            });
        }

        // Cerrar menú al hacer clic en overlay
        document.getElementById('overlay').addEventListener('click', () => {
            this.closeMenu();
        });

        // Navegación desde las tarjetas del dashboard
        document.querySelectorAll('.dashboard-card[data-section]').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Manejar hash changes para deep linking
        window.addEventListener('hashchange', () => {
            const section = window.location.hash.substring(1) || 'dashboard';
            this.navigateToSection(section);
        });
    }

    navigateToSection(section) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = section;

            // Actualizar URL
            window.location.hash = section;

            // Actualizar enlace activo en el menú
            this.updateActiveMenuLink(section);
        }

        // Cerrar menú en móviles
        if (window.innerWidth <= 768) {
            this.closeMenu();
        }
    }

    updateActiveMenuLink(section) {
        document.querySelectorAll('.side-menu a').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`.side-menu a[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    closeMenu() {
        document.getElementById('side-menu').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }

    loadUserData() {
        // Simular carga de datos del usuario
        const savedProgress = localStorage.getItem('visaHelperProgress');
        if (savedProgress) {
            this.userProgress = JSON.parse(savedProgress);
        }

        this.updateProgressUI();
    }

    updateProgressUI() {
        document.getElementById('progress-fill').style.width = `${this.userProgress.overall}%`;
        document.getElementById('progress-text').textContent = `${this.userProgress.overall}% completado`;
        document.getElementById('forms-completed').textContent = this.userProgress.forms;
        document.getElementById('docs-uploaded').textContent = this.userProgress.documents;
        document.getElementById('appointments-scheduled').textContent = this.userProgress.appointments;
    }

    renderDashboard() {
        // El dashboard ya está renderizado en el HTML
        // Aquí se pueden agregar actualizaciones dinámicas
    }

    loadDocuments() {
        const documents = [
            { id: 1, name: 'Pasaporte', status: 'completed', icon: 'bi-passport' },
            { id: 2, name: 'Fotografías', status: 'completed', icon: 'bi-image' },
            { id: 3, name: 'Formulario DS-160', status: 'completed', icon: 'bi-file-text' },
            { id: 4, name: 'Comprobante de Pago', status: 'pending', icon: 'bi-cash-stack' },
            { id: 5, name: 'Constancia Laboral', status: 'required', icon: 'bi-briefcase' },
            { id: 6, name: 'Estados de Cuenta', status: 'required', icon: 'bi-bank' },
            { id: 7, name: 'Comprobante de Domicilio', status: 'required', icon: 'bi-house' },
            { id: 8, name: 'Itinerario de Viaje', status: 'required', icon: 'bi-airplane' }
        ];

        const container = document.getElementById('documents-container');
        container.innerHTML = '';

        documents.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'document-card';
            card.innerHTML = `
                <i class="bi ${doc.icon}"></i>
                <h3>${doc.name}</h3>
                <div class="document-status status-${doc.status}">
                    ${this.getStatusText(doc.status)}
                </div>
            `;
            container.appendChild(card);
        });
    }

    getStatusText(status) {
        const statusTexts = {
            'completed': 'Completado',
            'pending': 'Pendiente',
            'required': 'Requerido'
        };
        return statusTexts[status] || status;
    }

    setupAppointments() {
        // Cargar citas existentes
        const savedAppointments = JSON.parse(localStorage.getItem('visaHelperAppointments')) || [];
        this.renderAppointments(savedAppointments);
    }

    renderAppointments(appointments) {
        const container = document.getElementById('appointments-list');

        if (appointments.length === 0) {
            container.innerHTML = '<div class="deadline-item">No hay citas programadas</div>';
            return;
        }

        container.innerHTML = '';
        appointments.forEach(appointment => {
            const element = document.createElement('div');
            element.className = 'deadline-item';
            element.innerHTML = `
                <strong>${appointment.summary}</strong><br>
                Fecha: ${new Date(appointment.start).toLocaleDateString()}<br>
                Hora: ${new Date(appointment.start).toLocaleTimeString()}<br>
                Lugar: ${appointment.location}
            `;
            container.appendChild(element);
        });
    }

    saveAppointment(appointment) {
        const appointments = JSON.parse(localStorage.getItem('visaHelperAppointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('visaHelperAppointments', JSON.stringify(appointments));
        this.renderAppointments(appointments);
    }
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', function () {
    // Configurar menú lateral
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');

    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    // Actualizar año actual y última modificación
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = 'Última modificación: ' + document.lastModified;

    // Inicializar aplicación
    window.visaHelperApp = new VisaHelperApp();

    // Manejar sección inicial desde hash de URL
    const initialSection = window.location.hash.substring(1) || 'dashboard';
    window.visaHelperApp.navigateToSection(initialSection);
});

// ===== INTEGRACIÓN CON EL SERVICIO DE CALENDARIO =====
// Sobrescribir la función del servicio de calendario para integrar con la app
const originalAddEvent = CalendarService.addEvent;
CalendarService.addEvent = async function (eventDetails) {
    const result = await originalAddEvent.call(this, eventDetails);
    if (result && window.visaHelperApp) {
        window.visaHelperApp.saveAppointment(eventDetails);

        // Actualizar progreso
        window.visaHelperApp.userProgress.appointments++;
        window.visaHelperApp.userProgress.overall = Math.min(
            window.visaHelperApp.userProgress.overall + 5,
            100
        );
        window.visaHelperApp.updateProgressUI();
        localStorage.setItem('visaHelperProgress', JSON.stringify(window.visaHelperApp.userProgress));
    }
    return result;
};

// ===== TRADUCTOR DE PÁGINA COMPLETA =====
class PageTranslator {
    static currentLanguage = 'es';
    static isTranslating = false;

    static async togglePageTranslation() {
        if (this.isTranslating) {
            this.showNotification('⚠️ Ya hay una traducción en proceso', 'warning');
            return;
        }

        try {
            this.isTranslating = true;
            
            if (this.currentLanguage === 'es') {
                await this.translatePageToEnglish();
            } else {
                this.restoreOriginalPage();
            }
            
        } catch (error) {
            console.error('Error en traducción de página:', error);
            this.showNotification('❌ Error al traducir la página', 'error');
        } finally {
            this.isTranslating = false;
        }
    }

    static async translatePageToEnglish() {
        this.showNotification('🌐 Traduciendo página al inglés...', 'info');

        // Elementos a traducir
        const elementsToTranslate = this.getTranslatableElements();
        
        let translatedCount = 0;
        const totalElements = elementsToTranslate.length;

        for (const element of elementsToTranslate) {
            try {
                const originalText = element.textContent.trim();
                
                if (originalText && this.shouldTranslateText(originalText)) {
                    // Usar el servicio de traducción existente
                    const translatedText = await this.translateText(originalText, 'en');
                    
                    if (translatedText && translatedText !== originalText) {
                        // Guardar texto original como data attribute
                        element.setAttribute('data-original-text', originalText);
                        element.textContent = translatedText;
                        translatedCount++;
                    }
                }
            } catch (error) {
                console.warn('Error traduciendo elemento:', error);
            }
        }

        // Actualizar botón
        this.updateTranslateButton('en');
        this.currentLanguage = 'en';
        
        this.showNotification(
            `✅ Página traducida al inglés (${translatedCount}/${totalElements} elementos)`, 
            'success'
        );
    }

    static restoreOriginalPage() {
        // Restaurar textos originales
        const translatedElements = document.querySelectorAll('[data-original-text]');
        
        translatedElements.forEach(element => {
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                element.textContent = originalText;
                element.removeAttribute('data-original-text');
            }
        });

        // Actualizar botón
        this.updateTranslateButton('es');
        this.currentLanguage = 'es';
        
        this.showNotification('🔙 Página restaurada al español', 'info');
    }

    static getTranslatableElements() {
        // Seleccionar elementos que contienen texto para traducir
        const selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'div:not(.no-translate)', 
            'li', 'td', 'th', 'label',
            '.welcome-banner p',
            '.dashboard-card p',
            '.form-step h3',
            '.sidebar-content h3', 
            '.sidebar-content h4',
            '.sidebar-content p',
            '.contact-info p',
            '.anniversary-title',
            '.anniversary-text',
            '.anniversary-year',
            '.menu-icon-text',
            '.deadline-item',
            '.api-item strong'
        ];

        const elements = [];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Excluir elementos vacíos, inputs, botones, etc.
                if (el.textContent.trim() && 
                    !el.closest('input, button, textarea, select, code, .no-translate') &&
                    !el.querySelector('input, button, textarea, select')) {
                    elements.push(el);
                }
            });
        });

        return elements;
    }

    static shouldTranslateText(text) {
        // Excluir textos que no deben traducirse
        const excludePatterns = [
            /^[0-9\s\.\%\$\€]+$/, // Solo números y símbolos
            /^[A-Z0-9\-\_]+$/, // Códigos, IDs
            /^.*@.*\..*$/, // Emails
            /^https?:\/\/.*/, // URLs
            /GoGainzer/, // Marca
            /Visa Helper/, // Nombre de la app
            /DS-160/, // Formulario
            /B1\/B2/, // Tipo de visa
            /USD/, // Moneda
        ];

        return !excludePatterns.some(pattern => pattern.test(text));
    }

    static updateTranslateButton(targetLanguage) {
        const button = document.getElementById('translate-page-btn');
        if (!button) return;

        if (targetLanguage === 'en') {
            button.innerHTML = '<i class="bi bi-translate"></i> Volver al Español';
            button.classList.add('translating');
        } else {
            button.innerHTML = '<i class="bi bi-translate"></i> Traducir Página';
            button.classList.remove('translating');
        }
    }

    static async translateText(text, targetLanguage = 'en') {
        if (!text || text.trim() === '') return text;

        try {
            console.log(`🌐 Traduciendo: "${text}" → ${targetLanguage}`);

            // Usar el endpoint de Netlify Functions
            const res = await fetch(`/.netlify/functions/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    text: text.trim(), 
                    target: targetLanguage 
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Error HTTP ${res.status}`);
            }

            const data = await res.json();
            return data.translatedText || text;

        } catch (err) {
            console.error('❌ Error al traducir:', err);
            // Fallback: devolver texto original
            return text;
        }
    }

    static showNotification(message, type = 'info') {
        // Usar el sistema de notificaciones existente si está disponible
        if (window.visaHelperApp && window.visaHelperApp.notificationManager) {
            window.visaHelperApp.notificationManager.show(message, type);
        } else {
            // Fallback simple
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#78e08f' : type === 'error' ? '#e55039' : '#4a69bd'};
                color: white;
                padding: 12px 16px;
                border-radius: 4px;
                z-index: 10000;
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 4000);
        }
    }
}

// Hacer disponible globalmente
window.PageTranslator = PageTranslator;
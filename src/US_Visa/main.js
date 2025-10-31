// US Visa Main Application - Combined ES Module
// Data Service
class DataService {
    static async fetchCountries() {
        try {
            console.log('🌍 Fetching countries from REST Countries API...');
            
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,cca2');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const countries = await response.json();
            console.log(`✅ ${countries.length} countries loaded successfully`);
            
            // Return first 15 countries with 4+ properties each
            return countries.slice(0, 15).map(country => ({
                name: country.name.common,
                capital: country.capital?.[0] || 'N/A',
                population: country.population?.toLocaleString() || 'N/A',
                region: country.region,
                flag: country.flags.png,
                code: country.cca2,
                currency: 'Various',
                language: 'Multiple',
                timezone: 'Various'
            }));
            
        } catch (error) {
            console.error('❌ Error fetching countries:', error);
            throw new Error('No se pudieron cargar los países. Por favor, intenta más tarde.');
        }
    }

    static async fetchLocalCountries() {
        const localCountries = [
            {
                name: "Estados Unidos",
                capital: "Washington D.C.",
                population: "331,000,000",
                region: "Américas",
                flag: "https://flagcdn.com/w320/us.png",
                code: "US",
                currency: "USD",
                language: "Inglés",
                timezone: "UTC-5 to UTC-10"
            },
            {
                name: "Canadá",
                capital: "Ottawa",
                population: "38,000,000",
                region: "Américas",
                flag: "https://flagcdn.com/w320/ca.png",
                code: "CA",
                currency: "CAD",
                language: "Inglés, Francés",
                timezone: "UTC-3.5 to UTC-8"
            },
            {
                name: "México",
                capital: "Ciudad de México",
                population: "128,000,000",
                region: "Américas",
                flag: "https://flagcdn.com/w320/mx.png",
                code: "MX",
                currency: "MXN",
                language: "Español",
                timezone: "UTC-5 to UTC-8"
            },
            {
                name: "Reino Unido",
                capital: "Londres",
                population: "67,000,000",
                region: "Europa",
                flag: "https://flagcdn.com/w320/gb.png",
                code: "GB",
                currency: "GBP",
                language: "Inglés",
                timezone: "UTC+0"
            },
            {
                name: "Alemania",
                capital: "Berlín",
                population: "83,000,000",
                region: "Europa",
                flag: "https://flagcdn.com/w320/de.png",
                code: "DE",
                currency: "EUR",
                language: "Alemán",
                timezone: "UTC+1"
            },
            {
                name: "Francia",
                capital: "París",
                population: "67,000,000",
                region: "Europa",
                flag: "https://flagcdn.com/w320/fr.png",
                code: "FR",
                currency: "EUR",
                language: "Francés",
                timezone: "UTC+1"
            },
            {
                name: "Italia",
                capital: "Roma",
                population: "60,000,000",
                region: "Europa",
                flag: "https://flagcdn.com/w320/it.png",
                code: "IT",
                currency: "EUR",
                language: "Italiano",
                timezone: "UTC+1"
            },
            {
                name: "España",
                capital: "Madrid",
                population: "47,000,000",
                region: "Europa",
                flag: "https://flagcdn.com/w320/es.png",
                code: "ES",
                currency: "EUR",
                language: "Español",
                timezone: "UTC+1"
            },
            {
                name: "Japón",
                capital: "Tokio",
                population: "126,000,000",
                region: "Asia",
                flag: "https://flagcdn.com/w320/jp.png",
                code: "JP",
                currency: "JPY",
                language: "Japonés",
                timezone: "UTC+9"
            },
            {
                name: "Australia",
                capital: "Canberra",
                population: "25,000,000",
                region: "Oceanía",
                flag: "https://flagcdn.com/w320/au.png",
                code: "AU",
                currency: "AUD",
                language: "Inglés",
                timezone: "UTC+8 to UTC+10"
            },
            {
                name: "Brasil",
                capital: "Brasilia",
                population: "213,000,000",
                region: "Américas",
                flag: "https://flagcdn.com/w320/br.png",
                code: "BR",
                currency: "BRL",
                language: "Portugués",
                timezone: "UTC-2 to UTC-5"
            },
            {
                name: "China",
                capital: "Pekín",
                population: "1,402,000,000",
                region: "Asia",
                flag: "https://flagcdn.com/w320/cn.png",
                code: "CN",
                currency: "CNY",
                language: "Chino",
                timezone: "UTC+8"
            },
            {
                name: "India",
                capital: "Nueva Delhi",
                population: "1,380,000,000",
                region: "Asia",
                flag: "https://flagcdn.com/w320/in.png",
                code: "IN",
                currency: "INR",
                language: "Hindi, Inglés",
                timezone: "UTC+5.5"
            },
            {
                name: "Sudáfrica",
                capital: "Pretoria",
                population: "59,000,000",
                region: "África",
                flag: "https://flagcdn.com/w320/za.png",
                code: "ZA",
                currency: "ZAR",
                language: "Afrikaans, Inglés",
                timezone: "UTC+2"
            },
            {
                name: "Argentina",
                capital: "Buenos Aires",
                population: "45,000,000",
                region: "Américas",
                flag: "https://flagcdn.com/w320/ar.png",
                code: "AR",
                currency: "ARS",
                language: "Español",
                timezone: "UTC-3"
            }
        ];

        console.log(`✅ ${localCountries.length} local countries loaded`);
        return localCountries;
    }
}

// Storage Service
class StorageService {
    static STORAGE_KEYS = {
        USER_PREFERENCES: 'visaUserPreferences',
        FORM_DATA: 'visaFormData',
        SELECTED_COUNTRIES: 'selectedCountries'
    };

    static saveUserPreferences(preferences) {
        try {
            const data = {
                ...preferences,
                lastUpdated: new Date().toISOString(),
                version: '1.0'
            };
            
            localStorage.setItem(this.STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data));
            console.log('💾 User preferences saved:', data);
            return true;
        } catch (error) {
            console.error('❌ Error saving user preferences:', error);
            return false;
        }
    }

    static getUserPreferences() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.USER_PREFERENCES);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Error loading user preferences:', error);
            return null;
        }
    }

    static saveFormData(formData) {
        try {
            const data = {
                formData: formData,
                timestamp: new Date().toISOString(),
                step: 'us_visa_form'
            };
            
            localStorage.setItem(this.STORAGE_KEYS.FORM_DATA, JSON.stringify(data));
            console.log('💾 Form data saved');
            return true;
        } catch (error) {
            console.error('❌ Error saving form data:', error);
            return false;
        }
    }

    static getFormData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.FORM_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Error loading form data:', error);
            return null;
        }
    }

    static saveSelectedCountry(country) {
        try {
            const selectedCountries = this.getSelectedCountries();
            selectedCountries.push({
                ...country,
                selectedAt: new Date().toISOString()
            });
            
            // Keep only last 5 selections
            const recentSelections = selectedCountries.slice(-5);
            
            localStorage.setItem(this.STORAGE_KEYS.SELECTED_COUNTRIES, JSON.stringify(recentSelections));
            console.log('💾 Selected country saved:', country.name);
            return true;
        } catch (error) {
            console.error('❌ Error saving selected country:', error);
            return false;
        }
    }

    static getSelectedCountries() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SELECTED_COUNTRIES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Error loading selected countries:', error);
            return [];
        }
    }

    static clearAllData() {
        try {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            console.log('🗑️ All visa data cleared from localStorage');
            return true;
        } catch (error) {
            console.error('❌ Error clearing data:', error);
            return false;
        }
    }
}

// Modal Service
class ModalService {
    static activeModal = null;

    static initModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`❌ Modal with id ${modalId} not found`);
            return null;
        }

        // Close buttons
        const closeButtons = modal.querySelectorAll('[data-close-modal]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(modalId));
        });

        // Escape key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal === modalId) {
                this.closeModal(modalId);
            }
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.hasAttribute('data-close-modal')) {
                this.closeModal(modalId);
            }
        });

        console.log(`✅ Modal ${modalId} initialized`);
        return modal;
    }

    static openModal(modalId, content = null) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`❌ Modal with id ${modalId} not found`);
            return false;
        }

        // Set content if provided
        if (content && typeof content === 'object') {
            this.setModalContent(modalId, content);
        }

        // Close any currently open modal
        if (this.activeModal && this.activeModal !== modalId) {
            this.closeModal(this.activeModal);
        }

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        this.activeModal = modalId;

        // Trap focus inside modal
        this.trapFocus(modal);

        console.log(`📂 Modal ${modalId} opened`);
        return true;
    }

    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return false;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        if (this.activeModal === modalId) {
            this.activeModal = null;
        }

        console.log(`📂 Modal ${modalId} closed`);
        return true;
    }

    static setModalContent(modalId, content) {
        const modal = document.getElementById(modalId);
        if (!modal) return false;

        const { title, body, footer } = content;

        if (title) {
            const titleElement = modal.querySelector('#modal-title');
            if (titleElement) titleElement.textContent = title;
        }

        if (body) {
            const bodyElement = modal.querySelector('#modal-body');
            if (bodyElement) bodyElement.innerHTML = body;
        }

        if (footer) {
            const footerElement = modal.querySelector('.modal-footer');
            if (footerElement) footerElement.innerHTML = footer;
        }

        return true;
    }

    static trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            modal.addEventListener('keydown', function trapHandler(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    }

    static createCountryModal(country) {
        const modalContent = {
            title: `🌍 ${country.name}`,
            body: `
                <div class="country-modal-content">
                    <img src="${country.flag}" alt="Bandera de ${country.name}" class="modal-flag">
                    <div class="modal-details">
                        <div class="detail-item">
                            <strong>Capital:</strong> ${country.capital}
                        </div>
                        <div class="detail-item">
                            <strong>Población:</strong> ${country.population}
                        </div>
                        <div class="detail-item">
                            <strong>Región:</strong> ${country.region}
                        </div>
                        <div class="detail-item">
                            <strong>Moneda:</strong> ${country.currency}
                        </div>
                        <div class="detail-item">
                            <strong>Idioma:</strong> ${country.language}
                        </div>
                        <div class="detail-item">
                            <strong>Zona Horaria:</strong> ${country.timezone}
                        </div>
                    </div>
                    <div class="modal-description">
                        <p>Ofrecemos servicios de visa completos para ${country.name}. 
                        Nuestros expertos te ayudarán con todo el proceso de solicitud.</p>
                    </div>
                </div>
            `,
            footer: `
                <button class="modal-btn" data-action="close">Cerrar</button>
                <button class="modal-btn primary" data-action="select" data-country='${JSON.stringify(country).replace(/'/g, "&apos;")}'>
                    Seleccionar este País
                </button>
            `
        };

        return modalContent;
    }
}

// Utils
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static announceToScreenReader(message) {
        // Create aria live region for screen readers
        let announcer = document.getElementById('aria-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'aria-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'visually-hidden';
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = message;
    }

    static formatNumber(number) {
        return new Intl.NumberFormat('es-MX').format(number);
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add styles if not exists
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 5px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideInNotification 0.3s ease;
                    max-width: 300px;
                }
                .notification.info { background: #0067FF; }
                .notification.success { background: #78e08f; color: #032247; }
                .notification.error { background: #e55039; }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 18px;
                    cursor: pointer;
                    margin-left: 10px;
                }
                @keyframes slideInNotification {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Main Application Class
class USVisaApplication {
    constructor() {
        this.countries = [];
        this.selectedCountries = [];
        this.currentStep = 1;
        this.init();
    }

    async init() {
        console.log('🚀 Initializing US Visa Application...');
        
        try {
            // Initialize modules
            this.initializeModules();
            
            // Load user data
            await this.loadUserData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load and display countries
            await this.loadCountries();
            
            console.log('✅ US Visa Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            Utils.showNotification('Error al inicializar la aplicación', 'error');
        }
    }

    initializeModules() {
        // Initialize modal
        ModalService.initModal('country-modal');
        
        // Setup modal event handlers
        this.setupModalHandlers();
        
        // Load saved preferences
        this.loadSavedPreferences();
    }

    async loadUserData() {
        // Load user preferences from localStorage
        const preferences = StorageService.getUserPreferences();
        if (preferences) {
            console.log('📥 Loaded user preferences:', preferences);
            this.applyUserPreferences(preferences);
        }

        // Load selected countries
        this.selectedCountries = StorageService.getSelectedCountries();
        if (this.selectedCountries.length > 0) {
            console.log(`📥 Loaded ${this.selectedCountries.length} selected countries`);
        }
    }

    applyUserPreferences(preferences) {
        // Apply theme if specified
        if (preferences.theme) {
            document.documentElement.setAttribute('data-theme', preferences.theme);
        }
    }

    setupEventListeners() {
        // Service buttons
        document.querySelectorAll('.service-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const service = button.getAttribute('data-service');
                this.handleServiceSelection(service);
            });
        });

        // Travel reasons
        document.querySelectorAll('.travel-reason').forEach(reason => {
            reason.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTravelReason(reason);
            });

            reason.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTravelReason(reason);
                }
            });
        });

        // Main form button
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.processMainForm();
            });
        }

        // Citizenship select
        const citizenshipSelect = document.getElementById('citizenship');
        if (citizenshipSelect) {
            citizenshipSelect.addEventListener('change', () => {
                this.saveFormProgress();
            });
        }

        // Multiple citizenship checkbox
        const multipleCitizenship = document.getElementById('multiple-citizenship');
        if (multipleCitizenship) {
            multipleCitizenship.addEventListener('change', () => {
                this.saveFormProgress();
            });
        }

        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupModalHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                const action = e.target.getAttribute('data-action');
                const countryData = e.target.getAttribute('data-country');
                
                switch (action) {
                    case 'select':
                        if (countryData) {
                            const country = JSON.parse(countryData);
                            this.handleCountrySelection(country);
                        }
                        ModalService.closeModal('country-modal');
                        break;
                    case 'close':
                        ModalService.closeModal('country-modal');
                        break;
                }
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                document.querySelector('main').focus();
                Utils.announceToScreenReader('Navegado al contenido principal');
            }
            
            if (e.altKey && e.key === '2') {
                e.preventDefault();
                document.querySelector('.services h2').focus();
                Utils.announceToScreenReader('Navegado a la sección de servicios');
            }
        });
    }

    async loadCountries() {
        const container = document.getElementById('countries-container');
        if (!container) return;

        try {
            Utils.showNotification('Cargando información de países...', 'info');
            this.countries = await DataService.fetchCountries();
        } catch (apiError) {
            console.warn('API failed, using local data:', apiError);
            try {
                this.countries = await DataService.fetchLocalCountries();
                Utils.showNotification('Usando datos locales', 'info');
            } catch (localError) {
                console.error('Both API and local data failed:', localError);
                Utils.showNotification('Error cargando países', 'error');
                container.innerHTML = '<div class="loading">Error cargando países. Por favor, recarga la página.</div>';
                return;
            }
        }

        this.displayCountries();
        Utils.showNotification(`${this.countries.length} países cargados correctamente`, 'success');
    }

    displayCountries() {
        const container = document.getElementById('countries-container');
        if (!container) return;

        const countriesHTML = this.countries.map(country => `
            <div class="country-card" 
                 data-country='${JSON.stringify(country).replace(/'/g, "&apos;")}'
                 tabindex="0"
                 role="button"
                 aria-label="Ver detalles de ${country.name}">
                <img src="${country.flag}" 
                     alt="Bandera de ${country.name}" 
                     class="country-flag"
                     loading="lazy">
                <h3 class="country-name">${country.name}</h3>
                <div class="country-info">
                    <p><strong>Capital:</strong> ${country.capital}</p>
                    <p><strong>Población:</strong> ${country.population}</p>
                    <p><strong>Región:</strong> ${country.region}</p>
                    <p><strong>Moneda:</strong> ${country.currency}</p>
                </div>
                <button class="btn btn-outline" 
                        onclick="usVisaApp.showCountryDetails('${country.name.replace(/'/g, "\\'")}')">
                    Ver Detalles
                </button>
            </div>
        `).join('');

        container.innerHTML = countriesHTML;
        this.setupCountryCardEvents();
    }

    setupCountryCardEvents() {
        document.querySelectorAll('.country-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn')) {
                    const countryData = card.getAttribute('data-country');
                    if (countryData) {
                        const country = JSON.parse(countryData);
                        this.showCountryModal(country);
                    }
                }
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const countryData = card.getAttribute('data-country');
                    if (countryData) {
                        const country = JSON.parse(countryData);
                        this.showCountryModal(country);
                    }
                }
            });
        });
    }

    showCountryModal(country) {
        const modalContent = ModalService.createCountryModal(country);
        ModalService.openModal('country-modal', modalContent);
        Utils.announceToScreenReader(`Modal abierto: Detalles de ${country.name}`);
    }

    showCountryDetails(countryName) {
        const country = this.countries.find(c => c.name === countryName);
        if (country) {
            this.showCountryModal(country);
        }
    }

    handleCountrySelection(country) {
        StorageService.saveSelectedCountry(country);
        this.selectedCountries.push(country);
        Utils.showNotification(`✅ ${country.name} seleccionado`, 'success');
        Utils.announceToScreenReader(`${country.name} ha sido seleccionado`);
        console.log('Selected country:', country);
    }

    toggleTravelReason(reason) {
        const checkbox = reason.querySelector('input');
        checkbox.checked = !checkbox.checked;
        reason.classList.toggle('selected', checkbox.checked);
        reason.setAttribute('aria-checked', checkbox.checked.toString());
        this.saveFormProgress();
        
        const label = reason.querySelector('.reason-label').textContent;
        const status = checkbox.checked ? 'seleccionado' : 'deseleccionado';
        Utils.announceToScreenReader(`${label} ${status}`);
    }

    handleServiceSelection(service) {
        const serviceNames = {
            'esta': 'U.S. ESTA',
            'visa': 'Servicio de Visa para EE.UU.',
            'vip': 'Visa VIP para EE.UU.'
        };
        
        const serviceName = serviceNames[service] || 'Servicio';
        Utils.showNotification(`Iniciando proceso para: ${serviceName}`, 'info');
        
        StorageService.saveUserPreferences({
            lastServiceSelected: service,
            lastServiceSelection: new Date().toISOString()
        });
        
        setTimeout(() => {
            alert(`🚀 ¡Perfecto! Estás iniciando el proceso para: ${serviceName}\n\nEsta es una demostración para un proyecto escolar.`);
        }, 500);
    }

    processMainForm() {
        const citizenship = document.getElementById('citizenship');
        const selectedOption = citizenship.options[citizenship.selectedIndex];
        
        if (!selectedOption.value) {
            citizenship.setAttribute('aria-invalid', 'true');
            citizenship.focus();
            Utils.showNotification('Por favor selecciona tu nacionalidad', 'error');
            Utils.announceToScreenReader('Error: Por favor selecciona tu nacionalidad');
            return;
        }
        
        const selectedReasons = Array.from(document.querySelectorAll('.travel-reason input:checked'))
            .map(checkbox => {
                const reason = checkbox.closest('.travel-reason');
                return reason.querySelector('.reason-label').textContent;
            });
        
        if (selectedReasons.length === 0) {
            Utils.showNotification('Por favor selecciona al menos una razón de viaje', 'error');
            Utils.announceToScreenReader('Error: Por favor selecciona al menos una razón de viaje');
            return;
        }
        
        const multipleCitizenship = document.getElementById('multiple-citizenship').checked;
        
        const formData = {
            citizenship: selectedOption.value,
            citizenshipText: selectedOption.text,
            multipleCitizenship: multipleCitizenship,
            travelReasons: selectedReasons,
            timestamp: new Date().toISOString()
        };
        
        StorageService.saveFormData(formData);
        this.redirectToActionPage(formData);
    }

    redirectToActionPage(formData) {
        const params = new URLSearchParams();
        params.append('citizenship', formData.citizenshipText);
        params.append('multipleCitizenship', formData.multipleCitizenship);
        params.append('travelReasons', formData.travelReasons.join(', '));
        params.append('timestamp', formData.timestamp);
        
        this.showFormSuccessModal(formData);
    }

    showFormSuccessModal(formData) {
        const modalContent = {
            title: '✅ Formulario Completado',
            body: `
                <div class="success-content">
                    <p>¡Tu información ha sido guardada correctamente!</p>
                    <div class="form-summary">
                        <h3>Resumen:</h3>
                        <p><strong>Nacionalidad:</strong> ${formData.citizenshipText}</p>
                        <p><strong>Múltiples nacionalidades:</strong> ${formData.multipleCitizenship ? 'Sí' : 'No'}</p>
                        <p><strong>Razones de viaje:</strong> ${formData.travelReasons.join(', ')}</p>
                    </div>
                    <p class="demo-note">Esta es una demostración para un proyecto escolar.</p>
                </div>
            `,
            footer: `
                <button class="modal-btn primary" data-action="close">Continuar</button>
            `
        };
        
        ModalService.openModal('country-modal', modalContent);
        Utils.announceToScreenReader('Formulario completado correctamente');
    }

    saveFormProgress() {
        const citizenship = document.getElementById('citizenship');
        const multipleCitizenship = document.getElementById('multiple-citizenship');
        const travelReasons = Array.from(document.querySelectorAll('.travel-reason input:checked'))
            .map(checkbox => checkbox.value);
        
        const formData = {
            citizenship: citizenship.value,
            multipleCitizenship: multipleCitizenship.checked,
            travelReasons: travelReasons,
            lastSaved: new Date().toISOString()
        };
        
        StorageService.saveFormData(formData);
    }

    loadSavedPreferences() {
        const savedFormData = StorageService.getFormData();
        if (savedFormData && savedFormData.formData) {
            this.restoreFormData(savedFormData.formData);
        }
    }

    restoreFormData(formData) {
        if (formData.citizenship) {
            const citizenshipSelect = document.getElementById('citizenship');
            citizenshipSelect.value = formData.citizenship;
        }
        
        if (formData.multipleCitizenship !== undefined) {
            const multipleCitizenship = document.getElementById('multiple-citizenship');
            multipleCitizenship.checked = formData.multipleCitizenship;
        }
        
        if (formData.travelReasons && Array.isArray(formData.travelReasons)) {
            formData.travelReasons.forEach(reasonValue => {
                const reasonElement = document.querySelector(`.travel-reason[data-value="${reasonValue}"]`);
                if (reasonElement) {
                    const checkbox = reasonElement.querySelector('input');
                    checkbox.checked = true;
                    reasonElement.classList.add('selected');
                    reasonElement.setAttribute('aria-checked', 'true');
                }
            });
        }
        
        console.log('📥 Form data restored from localStorage');
    }
}

// Initialize application
const usVisaApp = new USVisaApplication();
window.usVisaApp = usVisaApp;

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { USVisaApplication };
}

// Export individual classes for ES modules
export { DataService, StorageService, ModalService, Utils, USVisaApplication };
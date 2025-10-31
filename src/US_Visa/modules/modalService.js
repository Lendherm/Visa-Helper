// ES Module: Modal Service
export class ModalService {
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
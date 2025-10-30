// ===== MÓDULO DE VALIDACIÓN =====
export class ValidationManager {
    constructor(formManager) {
        this.formManager = formManager;
    }

    validateStep(stepIndex) {
        const formSteps = this.formManager.getFormSteps();
        const currentStep = formSteps[stepIndex];
        if (!currentStep) return false;

        const inputs = currentStep.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.formManager.notificationManager.show('Por favor completa todos los campos requeridos correctamente', 'error');
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');

        if (!isRequired && !value) {
            field.style.borderColor = '#ddd';
            return true;
        }

        if (isRequired && !value) {
            field.style.borderColor = '#e55039';
            this.showFieldError(field, 'Este campo es requerido');
            return false;
        }

        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa un email válido';
                }
                break;
            case 'tel':
                if (!this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa un número de teléfono válido';
                }
                break;
            case 'date':
                if (!this.isValidDate(field)) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa una fecha válida';
                }
                break;
            case 'text':
                if (field.id === 'passportNumber' && !this.isValidPassportNumber(value)) {
                    isValid = false;
                    errorMessage = 'El número de pasaporte debe contener solo letras y números';
                }
                break;
        }

        if (field.tagName === 'SELECT' && isRequired && !value) {
            isValid = false;
            errorMessage = 'Por favor selecciona una opción';
        }

        if (!isValid) {
            field.style.borderColor = '#e55039';
            this.showFieldError(field, errorMessage);
            return false;
        }

        field.style.borderColor = '#78e08f';
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#e55039';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;

        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    isValidDate(dateField) {
        const value = dateField.value;
        if (!value) return false;

        const date = new Date(value);
        const today = new Date();

        if (dateField.id === 'passportExpiryDate') {
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(today.getMonth() + 6);
            return date > sixMonthsFromNow;
        }

        if (dateField.id === 'birthDate') {
            return date <= today;
        }

        return !isNaN(date.getTime());
    }

    isValidPassportNumber(passportNumber) {
        const passportRegex = /^[A-Z0-9]{6,9}$/;
        return passportRegex.test(passportNumber);
    }
}
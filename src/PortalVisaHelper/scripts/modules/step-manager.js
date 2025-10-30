// ===== MÓDULO DE GESTIÓN DE PASOS =====
export class StepManager {
    constructor(formManager) {
        this.formManager = formManager;
    }

    showStep(stepIndex) {
        this.formManager.saveCurrentStepData();

        const formSteps = this.formManager.getFormSteps();
        const progressSteps = this.formManager.getProgressSteps();

        formSteps.forEach(step => step.classList.remove('active'));
        progressSteps.forEach(step => {
            step.classList.remove('active', 'completed');
        });

        if (formSteps[stepIndex]) {
            formSteps[stepIndex].classList.add('active');
        }

        progressSteps.forEach((step, index) => {
            if (index < stepIndex) {
                step.classList.add('completed');
            } else if (index === stepIndex) {
                step.classList.add('active');
            }
        });

        this.formManager.setCurrentStep(stepIndex);
        this.updateButtons();

        if (stepIndex === formSteps.length - 1) {
            this.showFormReview();
        }

        this.scrollToFormTop();
    }

    scrollToFormTop() {
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateButtons() {
        const currentStep = this.formManager.getCurrentStep();
        const formSteps = this.formManager.getFormSteps();
        const prevBtn = this.formManager.prevBtn;
        const nextBtn = this.formManager.nextBtn;
        const submitBtn = this.formManager.submitBtn;

        if (prevBtn) {
            prevBtn.disabled = currentStep === 0;
            prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        }

        if (currentStep === formSteps.length - 1) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'inline-block';
        } else {
            if (nextBtn) {
                nextBtn.style.display = 'inline-block';
                nextBtn.textContent = 'Siguiente';
            }
            if (submitBtn) submitBtn.style.display = 'none';
        }

        console.log(`Paso actual: ${currentStep + 1}, Total pasos: ${formSteps.length}`);
    }

    previousStep() {
        const currentStep = this.formManager.getCurrentStep();
        if (currentStep > 0) {
            this.formManager.saveCurrentStepData();
            this.showStep(currentStep - 1);
        }
    }

    nextStep() {
        const currentStep = this.formManager.getCurrentStep();
        const formSteps = this.formManager.getFormSteps();
        
        if (currentStep < formSteps.length - 1) {
            if (this.formManager.validationManager.validateStep(currentStep)) {
                this.formManager.saveCurrentStepData();
                this.showStep(currentStep + 1);
            }
        }
    }

    showFormReview() {
        const formData = new FormData(document.getElementById('visa-form'));
        const reviewContainer = document.getElementById('form-review');

        if (!reviewContainer) return;

        let reviewHTML = this.generateFormReviewHTML(formData);
        reviewContainer.innerHTML = reviewHTML;

        const calendarButton = document.createElement('button');
        calendarButton.type = 'button';
        calendarButton.className = 'calendar-btn';
        calendarButton.innerHTML = '<i class="bi bi-calendar-plus"></i> Agregar Recordatorio de Entrevista';
        calendarButton.onclick = () => this.addInterviewReminder();

        reviewContainer.appendChild(calendarButton);
    }

    generateFormReviewHTML(formData) {
        // Implementación simplificada - mantener la lógica original aquí
        return `
            <div class="form-review-section">
                <h4>Información Personal</h4>
                <div class="review-item"><strong>Nombre completo:</strong> ${formData.get('firstName')} ${formData.get('lastName')}</div>
                <!-- Resto del contenido del review -->
            </div>
        `;
    }

    addInterviewReminder() {
        const formData = new FormData(document.getElementById('visa-form'));
        const fullName = `${formData.get('firstName')} ${formData.get('lastName')}`;

        const eventDetails = {
            summary: `Entrevista de Visa - ${fullName}`,
            description: `Entrevista para visa ${formData.get('visaType')}. Recuerda llevar todos los documentos requeridos.`,
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
            location: 'Embajada o Consulado de EE.UU.'
        };

        if (window.CalendarService && typeof window.CalendarService.addEvent === 'function') {
            window.CalendarService.addEvent(eventDetails)
                .then(() => {
                    this.formManager.notificationManager.show('Recordatorio agregado al calendario', 'success');
                })
                .catch(error => {
                    console.error('Error adding calendar event:', error);
                    this.formManager.notificationManager.show('Error al agregar recordatorio', 'error');
                });
        } else {
            this.formManager.notificationManager.show('Función de calendario no disponible', 'info');
        }
    }

    getSelectedText(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return '';

        const selectedOption = select.options[select.selectedIndex];
        if (!selectedOption) return '';

        const text = selectedOption.textContent;
        return text.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '').trim();
    }

    formatDate(dateString) {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }
}
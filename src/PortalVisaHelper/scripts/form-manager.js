// ===== MÓDULO PRINCIPAL - FORM MANAGER =====
import { DiagnosisManager } from './modules/diagnosis-manager.js';
import { CookieManager } from './modules/cookie-manager.js';
import { CountryManager } from './modules/country-manager.js';
import { ValidationManager } from './modules/validation-manager.js';
import { StepManager } from './modules/step-manager.js';
import { NotificationManager } from './modules/notification-manager.js';
import { FormUtils, DateUtils } from './utils/form-utils.js';

class FormManager {
    constructor() {
        this.currentStep = 0;
        this.formSteps = document.querySelectorAll('.form-step');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.submitBtn = document.getElementById('submit-btn');

        // Inicializar módulos
        this.diagnosisManager = new DiagnosisManager(this);
        this.cookieManager = new CookieManager();
        this.countryManager = new CountryManager(this);
        this.validationManager = new ValidationManager(this);
        this.stepManager = new StepManager(this);
        this.notificationManager = new NotificationManager();

        this.autoSaveTimeout = null;
        this.isRestoringData = false;
        this.hasJustSaved = false;

        console.log('Elementos encontrados:', {
            formSteps: this.formSteps.length,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            submitBtn: !!this.submitBtn,
            hasSavedData: this.cookieManager.hasSavedData()
        });

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupConditionalLogic();

        // Cargar países y luego restaurar datos
        await this.countryManager.loadCountriesFromAPI();

        setTimeout(() => {
            this.stepManager.showStep(0);
            this.loadSavedData();
            this.setupAutoSave();
            this.countryManager.setupAllCountrySelects();

            // Ejecutar diagnóstico automático
            setTimeout(() => {
                this.diagnosisManager.runComprehensiveDiagnosis();
            }, 1000);
        }, 500);
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.stepManager.previousStep());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.stepManager.nextStep());
        }

        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }

        // Validación en tiempo real
        document.querySelectorAll('#visa-form input, #visa-form select, #visa-form textarea').forEach(input => {
            input.addEventListener('blur', () => this.validationManager.validateField(input));
        });

        document.getElementById('visa-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Botón para limpiar datos guardados
        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres eliminar todos los datos guardados?')) {
                    this.cookieManager.clearFormData();
                    this.clearLocalStorage();
                    document.getElementById('visa-form').reset();
                    this.notificationManager.show('Datos guardados eliminados', 'info');
                    clearDataBtn.style.display = 'none';
                    this.stepManager.showStep(0);
                }
            });
        }
    }

    setupAutoSave() {
        document.querySelectorAll('#visa-form input, #visa-form select, #visa-form textarea').forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(this.autoSaveTimeout);
                this.autoSaveTimeout = setTimeout(() => {
                    this.saveCurrentStepData();
                    this.notificationManager.showAutoSaveIndicator();
                }, 1000);
            });

            if (input.tagName === 'SELECT') {
                input.addEventListener('change', () => {
                    this.saveCurrentStepData();
                });
            }
        });
    }

    setupConditionalLogic() {
        // Lógica condicional movida a un módulo separado si es extensa
        this.setupRelativeLogic();
        this.setupPassportLogic();
        this.setupCriminalLogic();
        this.setupCertificationLogic();
    }

    setupRelativeLogic() {
        document.querySelectorAll('input[name="usRelative"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const detailsSection = document.getElementById('usRelativeDetails');
                if (detailsSection) {
                    detailsSection.style.display = e.target.value === 'yes' ? 'block' : 'none';
                    if (e.target.value === 'yes') {
                        document.getElementById('usRelativeName').setAttribute('required', 'true');
                        document.getElementById('usRelativeRelationship').setAttribute('required', 'true');
                        document.getElementById('usRelativeStatus').setAttribute('required', 'true');
                    } else {
                        document.getElementById('usRelativeName').removeAttribute('required');
                        document.getElementById('usRelativeRelationship').removeAttribute('required');
                        document.getElementById('usRelativeStatus').removeAttribute('required');
                    }
                }
                this.saveCurrentStepData();
            });
        });
    }

    setupPassportLogic() {
        document.querySelectorAll('input[name="lostPassport"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.saveCurrentStepData();
            });
        });
    }

    setupCriminalLogic() {
        document.querySelectorAll('input[name="criminal"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'yes') {
                    document.getElementById('additionalSecurityInfo').setAttribute('required', 'true');
                } else {
                    document.getElementById('additionalSecurityInfo').removeAttribute('required');
                }
                this.saveCurrentStepData();
            });
        });
    }

    setupCertificationLogic() {
        document.querySelectorAll('#step-9 input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveCurrentStepData();
            });
        });
    }

    // Métodos principales que delegan a módulos específicos
    loadSavedData() {
        console.log('🔄 INICIANDO CARGA DE DATOS GUARDADOS...');

        setTimeout(() => {
            let savedData = this.cookieManager.loadFormData();

            if (!savedData || FormUtils.isDataEmpty(savedData)) {
                console.log('🔄 Intentando cargar desde localStorage...');
                savedData = this.loadFromLocalStorage();
            }

            if (savedData && !FormUtils.isDataEmpty(savedData)) {
                console.log('📥 Datos cargados:', savedData);
                this.isRestoringData = true;
                FormUtils.populateFormWithSavedData(savedData, this.cookieManager);
                this.notificationManager.showRestoreNotification();

                setTimeout(() => {
                    this.isRestoringData = false;
                    console.log('✅ Restauración completada - Guardado automático reactivado');
                }, 1500);
            } else {
                console.log('ℹ️ No se encontraron datos guardados');
            }
        }, 300);
    }

    saveCurrentStepData() {
        if (this.isRestoringData) {
            console.log('⏸️ Guardado pausado durante restauración');
            return false;
        }

        const currentStep = this.formSteps[this.currentStep];
        if (!currentStep) return;

        const stepData = FormUtils.collectStepData(currentStep);

        if (FormUtils.hasRealData(stepData)) {
            let success = this.cookieManager.saveStepData(this.currentStep + 1, stepData);

            if (!success) {
                console.log('🔄 Intentando fallback a localStorage...');
                success = this.saveToLocalStorage(this.currentStep + 1, stepData);
            }

            if (success) {
                console.log(`💾 Paso ${this.currentStep + 1} guardado:`, stepData);
                this.hasJustSaved = true;
                setTimeout(() => { this.hasJustSaved = false; }, 1000);
            }
            return success;
        } else {
            console.log(`⏭️ Paso ${this.currentStep + 1} sin datos reales, no se guarda`);
            return false;
        }
    }

    async submitForm() {
        const certifyTruthful = document.getElementById('certifyTruthful');
        const understandPenalties = document.getElementById('understandPenalties');
        const authorizeUse = document.getElementById('authorizeUse');

        if (!certifyTruthful || !certifyTruthful.checked ||
            !understandPenalties || !understandPenalties.checked ||
            !authorizeUse || !authorizeUse.checked) {
            this.notificationManager.show('Debes aceptar todas las certificaciones para enviar la solicitud', 'error');
            return;
        }

        if (!this.validationManager.validateStep(this.currentStep)) {
            this.notificationManager.show('Por favor corrige los errores antes de enviar', 'error');
            return;
        }

        try {
            this.notificationManager.show('Enviando solicitud de visa a la base de datos...', 'info');

            const formData = new FormData(document.getElementById('visa-form'));
            const formObject = Object.fromEntries(formData.entries());

            console.log('📤 Datos del formulario a enviar:', formObject);

            if (window.googleSheetsService) {
                const result = await window.googleSheetsService.saveFormData(formObject);

                if (result.success) {
                    this.notificationManager.show('¡Solicitud de visa guardada en la base de datos!', 'success');
                    this.handleSuccessfulSubmission();
                } else {
                    throw new Error(result.error || 'Error desconocido al guardar');
                }
            } else {
                throw new Error('Servicio de Google Sheets no disponible');
            }

        } catch (error) {
            console.error('Error enviando formulario a Google Sheets:', error);
            this.notificationManager.show('Error al enviar la solicitud: ' + error.message, 'error');
            this.handleSubmissionFallback();
        }
    }

    handleSuccessfulSubmission() {
        this.cookieManager.clearFormData();
        this.clearLocalStorage();

        if (window.visaHelperApp) {
            window.visaHelperApp.userProgress.forms++;
            window.visaHelperApp.userProgress.overall = Math.min(
                window.visaHelperApp.userProgress.overall + 10,
                100
            );
            window.visaHelperApp.updateProgressUI();
            localStorage.setItem('visaHelperProgress', JSON.stringify(window.visaHelperApp.userProgress));
        }

        setTimeout(() => {
            window.location.hash = '#dashboard';
            if (document.getElementById('dashboard')) {
                document.getElementById('dashboard').classList.add('active');
            }
            if (document.getElementById('forms')) {
                document.getElementById('forms').classList.remove('active');
            }

            document.getElementById('visa-form').reset();
            this.stepManager.showStep(0);

            const clearDataBtn = document.getElementById('clear-data-btn');
            if (clearDataBtn) {
                clearDataBtn.style.display = 'none';
            }
        }, 3000);
    }

    handleSubmissionFallback() {
        this.notificationManager.show('Guardando localmente como respaldo...', 'warning');
        const formData = new FormData(document.getElementById('visa-form'));
        const formObject = Object.fromEntries(formData.entries());
        
        const submissions = JSON.parse(localStorage.getItem('visaSubmissions') || '[]');
        submissions.push({
            ...formObject,
            submissionDate: new Date().toISOString(),
            status: 'pending_retry'
        });
        localStorage.setItem('visaSubmissions', JSON.stringify(submissions));
    }

    // Métodos de utilidad (delegados)
    saveToLocalStorage(stepNumber, stepData) {
        return FormUtils.saveToLocalStorage(stepNumber, stepData);
    }

    loadFromLocalStorage() {
        return FormUtils.loadFromLocalStorage();
    }

    clearLocalStorage() {
        FormUtils.clearLocalStorage();
    }

    hasLocalStorageData() {
        return FormUtils.hasLocalStorageData();
    }

    // Métodos de acceso para módulos externos
    getCurrentStep() {
        return this.currentStep;
    }

    setCurrentStep(step) {
        this.currentStep = step;
    }

    getFormSteps() {
        return this.formSteps;
    }

    getProgressSteps() {
        return this.progressSteps;
    }

    // Métodos de utilidad para diagnóstico
    quickTest() {
        this.diagnosisManager.quickTest();
    }

    fixKeyboardSearch() {
        this.countryManager.fixKeyboardSearch();
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (document.getElementById('visa-form')) {
            window.formManager = new FormManager();

            // Hacer disponible el diagnóstico globalmente
            window.diagnoseForm = function () {
                window.formManager.diagnosisManager.runComprehensiveDiagnosis();
            };

            window.fixSearch = function () {
                window.formManager.countryManager.fixKeyboardSearch();
            };

            window.quickTest = function () {
                window.formManager.diagnosisManager.quickTest();
            };

            console.log('🎯 FormManager inicializado');
            console.log('🔧 Comandos disponibles:');
            console.log('   • diagnoseForm() - Diagnóstico completo');
            console.log('   • fixSearch() - Reparar búsqueda');
            console.log('   • quickTest() - Instrucciones de prueba');
        }
    }, 100);
});

export { FormManager };
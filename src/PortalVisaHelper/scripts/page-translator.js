import { TranslationService } from "./api-service.js";

// ===== GESTIÓN DE FORMULARIOS - VERSIÓN COMPLETA CON DIAGNÓSTICO =====

class FormManager {
    constructor() {
        this.currentStep = 0;
        this.formSteps = document.querySelectorAll('.form-step');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.submitBtn = document.getElementById('submit-btn');

        // Inicializar Cookie Manager
        this.cookieManager = new CookieManager();
        this.autoSaveTimeout = null;
        this.isRestoringData = false;
        this.hasJustSaved = false;

        // Para búsqueda por teclado
        this.currentSearch = '';
        this.searchTimeout = null;

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

        // PRIMERO cargar países, LUEGO restaurar datos
        await this.loadCountriesFromAPI();

        // ESPERAR un poco más antes de restaurar
        setTimeout(() => {
            this.showStep(0);
            this.loadSavedData();
            this.setupAutoSave();

            // Configurar búsqueda por teclado para todos los selects de países
            this.setupAllCountrySelects();

            // Ejecutar diagnóstico automático
            setTimeout(() => {
                this.runComprehensiveDiagnosis();
            }, 1000);
        }, 500);
    }

    // ===== DIAGNÓSTICO COMPLETO =====

    runComprehensiveDiagnosis() {
        console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO...');

        this.diagnoseCountrySelects();
        this.diagnoseKeyboardSearch();
        this.diagnoseFormSteps();
        this.diagnoseCookieManager();

        console.log('✅ DIAGNÓSTICO COMPLETADO');

        // Mostrar resumen en consola
        this.showDiagnosisSummary();
    }

    diagnoseCountrySelects() {
        console.log('🌍 DIAGNÓSTICO: Selects de Países');

        const expectedSelects = [
            'birthCountry',
            'nationality',
            'passportIssuingCountry',
            'country'
        ];

        let workingSelects = 0;
        let totalSelects = 0;

        expectedSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            totalSelects++;

            if (select) {
                const optionsCount = select.options.length;
                const hasOptions = optionsCount > 1;
                const isEnabled = !select.disabled;
                const isVisible = select.offsetParent !== null;

                console.log(`   ${selectId}:`, {
                    '✅ Existe': 'SÍ',
                    '📊 Opciones': optionsCount,
                    '🔄 Habilitado': isEnabled ? 'SÍ' : 'NO',
                    '👀 Visible': isVisible ? 'SÍ' : 'NO',
                    '🎯 Listo': hasOptions && isEnabled ? '✅ SÍ' : '❌ NO'
                });

                if (hasOptions && isEnabled) {
                    workingSelects++;
                }
            } else {
                console.log(`   ${selectId}: ❌ NO EXISTE`);
            }
        });

        console.log(`   📈 RESUMEN: ${workingSelects}/${totalSelects} selects funcionando`);
        return workingSelects === totalSelects;
    }

    diagnoseKeyboardSearch() {
        console.log('⌨️ DIAGNÓSTICO: Búsqueda por Teclado');

        const testSelects = document.querySelectorAll(`
            #birthCountry, #nationality, #passportIssuingCountry, #country
        `);

        console.log(`   🔍 Encontrados ${testSelects.length} selects para probar`);

        testSelects.forEach((select, index) => {
            const hasSearchHandler = select.hasAttribute('data-search-enabled');

            console.log(`   ${select.id}:`, {
                '🔧 Configurado': hasSearchHandler ? '✅ SÍ' : '❌ NO',
                '💬 Estado': hasSearchHandler ? '✅ FUNCIONANDO' : '⚠️ PROBLEMAS'
            });
        });
    }

    diagnoseFormSteps() {
        console.log('📝 DIAGNÓSTICO: Pasos del Formulario');

        console.log(`   📊 Total pasos: ${this.formSteps.length}`);
        console.log(`   🎯 Paso actual: ${this.currentStep + 1}`);

        this.formSteps.forEach((step, index) => {
            const isActive = step.classList.contains('active');
            const inputs = step.querySelectorAll('input, select, textarea');
            const filledInputs = step.querySelectorAll('input[value]:not([value=""]), select[value]:not([value=""]), textarea[value]:not([value=""])');

            console.log(`   Paso ${index + 1}:`, {
                '✅ Activo': isActive ? 'SÍ' : 'NO',
                '📝 Campos': inputs.length,
                '💾 Llenos': filledInputs.length
            });
        });
    }

    diagnoseCookieManager() {
        console.log('🍪 DIAGNÓSTICO: Cookie Manager');

        const cookieInfo = this.cookieManager.getCookieInfo();
        const hasData = this.cookieManager.hasSavedData();

        console.log('   Cookie Manager:', {
            '✅ Soporte': this.cookieManager.isSupported ? 'SÍ' : '❌ NO',
            '💾 Datos guardados': hasData ? 'SÍ' : 'NO',
            '📊 Pasos guardados': cookieInfo ? cookieInfo.stepsSaved : 0,
            '🕒 Último guardado': cookieInfo ? cookieInfo.lastSave : 'Nunca'
        });
    }

    showDiagnosisSummary() {
        const summary = `
🎯 DIAGNÓSTICO COMPLETADO - RESUMEN:

🌍 SELECTS DE PAÍSES:
   • birthCountry: ${document.getElementById('birthCountry') ? '✅' : '❌'}
   • nationality: ${document.getElementById('nationality') ? '✅' : '❌'} 
   • passportIssuingCountry: ${document.getElementById('passportIssuingCountry') ? '✅' : '❌'}
   • country: ${document.getElementById('country') ? '✅' : '❌'}

⌨️ BÚSQUEDA POR TECLADO:
   • Para usar: Haz clic en un select y escribe una letra
   • Ejemplo: Escribe "m" para buscar México

💾 DATOS GUARDADOS:
   • ${this.cookieManager.hasSavedData() ? '✅ Hay datos guardados' : '⚠️ No hay datos guardados'}

📝 PASOS DEL FORMULARIO:
   • Paso actual: ${this.currentStep + 1} de ${this.formSteps.length}

🔧 SOLUCIÓN DE PROBLEMAS:
   • Si la búsqueda no funciona, ejecuta: formManager.fixKeyboardSearch()
   • Para más detalles ejecuta: formManager.runComprehensiveDiagnosis()
        `;

        console.log(summary);
    }

    // ===== SOLUCIÓN DE PROBLEMAS =====

    fixKeyboardSearch() {
        console.log('🔧 EJECUTANDO REPARACIÓN DE BÚSQUEDA...');

        // 1. Limpiar configuraciones existentes
        const allSelects = document.querySelectorAll('#birthCountry, #nationality, #passportIssuingCountry, #country');
        allSelects.forEach(select => {
            select.removeAttribute('data-search-enabled');
        });

        // 2. Reconfigurar con método simple y confiable
        setTimeout(() => {
            this.setupReliableKeyboardSearch();
            console.log('✅ REPARACIÓN COMPLETADA');
            this.showNotification('Búsqueda por teclado reparada', 'success');
        }, 500);
    }

    setupReliableKeyboardSearch() {
        console.log('🔧 Configurando búsqueda confiable...');

        const selectIds = ['birthCountry', 'nationality', 'passportIssuingCountry', 'country'];

        selectIds.forEach(id => {
            const select = document.getElementById(id);
            if (select && select.options.length > 1) {
                this.setupSimpleSearch(select);
                select.setAttribute('data-search-enabled', 'true');
                console.log(`✅ ${id}: Búsqueda configurada`);
            }
        });
    }

    setupSimpleSearch(selectElement) {
        let searchString = '';
        let timeoutId = null;

        selectElement.addEventListener('keydown', (e) => {
            // Ignorar teclas de control y navegación
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            if (['Tab', 'Escape', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

            // Manejar Backspace
            if (e.key === 'Backspace') {
                e.preventDefault();
                searchString = searchString.slice(0, -1);
                console.log(`🔍 [${selectElement.id}] Borrado: "${searchString}"`);
                this.performSearch(selectElement, searchString);
                this.resetSearchTimeout(timeoutId, () => { searchString = ''; });
                return;
            }

            // Solo procesar letras
            if (e.key.length === 1 && /[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]/i.test(e.key)) {
                e.preventDefault();

                searchString += e.key.toLowerCase();
                console.log(`🔍 [${selectElement.id}] Buscando: "${searchString}"`);

                this.performSearch(selectElement, searchString);
                timeoutId = this.resetSearchTimeout(timeoutId, () => { searchString = ''; });
            }
        });

        // Agregar estilo visual
        selectElement.style.cssText += `
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>');
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 16px;
            padding-right: 35px;
        `;
    }

    performSearch(selectElement, searchString) {
        if (!searchString) {
            selectElement.selectedIndex = 0;
            return;
        }

        let found = false;
        for (let i = 0; i < selectElement.options.length; i++) {
            const option = selectElement.options[i];
            if (option.value && option.text) {
                const cleanText = option.text.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '').trim().toLowerCase();
                if (cleanText.startsWith(searchString)) {
                    selectElement.selectedIndex = i;
                    found = true;
                    console.log(`✅ [${selectElement.id}] Encontrado: ${option.text}`);

                    // Disparar evento change
                    const changeEvent = new Event('change', { bubbles: true });
                    selectElement.dispatchEvent(changeEvent);
                    break;
                }
            }
        }

        if (!found) {
            console.log(`❌ [${selectElement.id}] No se encontró país con "${searchString}"`);
        }
    }

    resetSearchTimeout(timeoutId, callback) {
        clearTimeout(timeoutId);
        return setTimeout(callback, 1500);
    }

    // ===== CONFIGURACIÓN PRINCIPAL =====

    setupAllCountrySelects() {
        console.log('🔧 Configurando búsqueda para todos los selects...');
        this.setupReliableKeyboardSearch();
    }

    setupEventListeners() {
        // Verificar que los botones existan antes de agregar event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousStep());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextStep());
        }

        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }

        // Validación en tiempo real
        document.querySelectorAll('#visa-form input, #visa-form select, #visa-form textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Manejar envío del formulario
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
                    this.showNotification('Datos guardados eliminados', 'info');
                    clearDataBtn.style.display = 'none';
                    // También resetear el paso actual
                    this.showStep(0);
                }
            });
        }
    }

    setupAutoSave() {
        // Guardar automáticamente después de que el usuario deje de escribir
        document.querySelectorAll('#visa-form input, #visa-form select, #visa-form textarea').forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(this.autoSaveTimeout);
                this.autoSaveTimeout = setTimeout(() => {
                    this.saveCurrentStepData();
                    this.showAutoSaveNotification();
                }, 1000); // Guardar después de 1 segundo de inactividad
            });

            // También guardar al cambiar selects
            if (input.tagName === 'SELECT') {
                input.addEventListener('change', () => {
                    this.saveCurrentStepData();
                });
            }
        });
    }

    setupConditionalLogic() {
        // Mostrar/ocultar detalles de familiar en EE.UU.
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
                this.saveCurrentStepData(); // Guardar al cambiar
            });
        });

        // Mostrar/ocultar detalles de pasaporte perdido
        document.querySelectorAll('input[name="lostPassport"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.saveCurrentStepData(); // Guardar al cambiar
            });
        });

        // Mostrar/ocultar detalles de antecedentes penales
        document.querySelectorAll('input[name="criminal"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'yes') {
                    document.getElementById('additionalSecurityInfo').setAttribute('required', 'true');
                } else {
                    document.getElementById('additionalSecurityInfo').removeAttribute('required');
                }
                this.saveCurrentStepData(); // Guardar al cambiar
            });
        });

        // Guardar al cambiar checkboxes de certificación
        document.querySelectorAll('#step-9 input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveCurrentStepData();
            });
        });
    }

    // Cargar datos guardados - VERSIÓN CON FALLBACK
    loadSavedData() {
        console.log('🔄 INICIANDO CARGA DE DATOS GUARDADOS...');

        // Esperar un poco más para asegurar que las cookies estén listas
        setTimeout(() => {
            let savedData = this.cookieManager.loadFormData();

            // FALLBACK: cargar desde localStorage si las cookies están vacías
            if (!savedData || this.isDataEmpty(savedData)) {
                console.log('🔄 Intentando cargar desde localStorage...');
                savedData = this.loadFromLocalStorage();
            }

            if (savedData && !this.isDataEmpty(savedData)) {
                console.log('📥 Datos cargados:', savedData);

                // DESACTIVAR guardado automático temporalmente
                this.isRestoringData = true;

                this.populateFormWithSavedData(savedData);
                this.showRestoreNotification();

                // Reactivar guardado automático después de la restauración
                setTimeout(() => {
                    this.isRestoringData = false;
                    console.log('✅ Restauración completada - Guardado automático reactivado');
                }, 1500);
            } else {
                console.log('ℹ️ No se encontraron datos guardados');
            }
        }, 300);
    }

    // Verificar si los datos están vacíos
    isDataEmpty(savedData) {
        for (let stepKey in savedData) {
            if (stepKey.startsWith('step_')) {
                const stepData = savedData[stepKey];
                for (let fieldName in stepData) {
                    if (stepData[fieldName] && stepData[fieldName] !== '') {
                        return false; // Hay al menos un dato no vacío
                    }
                }
            }
        }
        return true; // Todos los datos están vacíos
    }

    // Poblar el formulario con datos guardados - VERSIÓN MEJORADA
    populateFormWithSavedData(savedData) {
        console.log('🔧 INICIANDO RESTAURACIÓN DE DATOS...');

        // Contador de campos restaurados
        let restoredCount = 0;

        Object.keys(savedData).forEach(stepKey => {
            if (stepKey.startsWith('step_')) {
                const stepNumber = parseInt(stepKey.replace('step_', ''));
                const stepData = savedData[stepKey];
                console.log(`🔧 Restaurando ${stepKey}:`, stepData);

                Object.keys(stepData).forEach(fieldName => {
                    const field = document.querySelector(`[name="${fieldName}"]`);
                    if (field) {
                        const value = stepData[fieldName];

                        // SOLO restaurar si hay valor válido (no vacío, no undefined, no 'undefined')
                        if (value && value !== '' && value !== null && value !== undefined && value !== 'undefined') {
                            if (field.type === 'radio') {
                                // BUSCAR en todo el documento, no solo en el paso actual
                                const radioToCheck = document.querySelector(`[name="${fieldName}"][value="${value}"]`);
                                if (radioToCheck) {
                                    radioToCheck.checked = true;
                                    restoredCount++;
                                    console.log(`✅ Radio seleccionado: ${fieldName} = ${value}`);
                                    // Disparar evento change
                                    const event = new Event('change', { bubbles: true });
                                    radioToCheck.dispatchEvent(event);
                                }
                            } else if (field.type === 'checkbox') {
                                field.checked = value === true || value === 'true';
                                if (field.checked) {
                                    restoredCount++;
                                    console.log(`✅ Checkbox: ${fieldName} = ${field.checked}`);
                                }
                            } else if (field.tagName === 'SELECT') {
                                if (this.setSelectValue(field, value)) {
                                    restoredCount++;
                                    console.log(`✅ Select: ${fieldName} = ${value}`);
                                }
                            } else {
                                field.value = value;
                                restoredCount++;
                                console.log(`✅ Campo: ${fieldName} = ${value}`);
                            }
                        } else {
                            console.log(`⏭️ Campo ${fieldName} omitido - valor inválido:`, value);
                        }
                    }
                });
            }
        });

        console.log(`✅ RESTAURACIÓN COMPLETADA: ${restoredCount} campos restaurados`);

        // Mostrar botón de limpiar datos
        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn && (this.cookieManager.hasSavedData() || this.hasLocalStorageData())) {
            clearDataBtn.style.display = 'inline-block';
        }
    }

    // Método para establecer valores en selects - VERSIÓN MEJORADA
    setSelectValue(selectElement, value) {
        if (!value && value !== '') {
            console.log(`⏭️ Select ${selectElement.name}: valor vacío, omitiendo`);
            return false;
        }

        // Si el valor es undefined, no hacer nada
        if (value === undefined || value === 'undefined') {
            console.log(`⏭️ Select ${selectElement.name}: valor undefined, omitiendo`);
            return false;
        }

        console.log(`🔧 Estableciendo select ${selectElement.name} = ${value}`);

        // Intentar establecer el valor directamente
        selectElement.value = value;

        // Verificar si se estableció correctamente
        if (selectElement.value === value) {
            console.log(`✅ Select ${selectElement.name} establecido directamente`);
            return true;
        }

        // Si no se pudo establecer, buscar por texto (sin emojis)
        console.log(`🔍 Buscando alternativa para select ${selectElement.name}...`);
        for (let option of selectElement.options) {
            // Comparar tanto el valor como el texto (sin emojis)
            const optionText = option.textContent.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '').trim();
            const optionValue = option.value;

            if (optionValue === value || optionText === value) {
                selectElement.value = optionValue;
                console.log(`✅ Select ${selectElement.name} establecido por coincidencia: ${optionValue}`);
                return true;
            }
        }

        console.warn(`⚠️ No se pudo establecer el valor ${value} en select ${selectElement.name}`);
        return false;
    }

    // Mostrar notificación de datos restaurados
    showRestoreNotification() {
        const notification = document.createElement('div');
        notification.className = 'notification info';
        notification.innerHTML = `
            <i class="bi bi-info-circle"></i>
            <span>Se han restaurado los datos guardados automáticamente.</span>
            <button onclick="this.parentElement.remove()" class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // ===== MÉTODOS DE FALLBACK A LOCALSTORAGE =====

    saveToLocalStorage(stepNumber, stepData) {
        try {
            const currentData = JSON.parse(localStorage.getItem('visaFormData') || '{}');
            currentData[`step_${stepNumber}`] = stepData;
            currentData.timestamp = new Date().toISOString();

            localStorage.setItem('visaFormData', JSON.stringify(currentData));
            console.log(`💾 Paso ${stepNumber} guardado en localStorage`);
            return true;
        } catch (error) {
            console.error('❌ Error guardando en localStorage:', error);
            return false;
        }
    }

    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem('visaFormData');
            if (data) {
                const parsed = JSON.parse(data);
                console.log('📥 Datos cargados desde localStorage');
                return parsed;
            }
            return null;
        } catch (error) {
            console.error('❌ Error cargando desde localStorage:', error);
            return null;
        }
    }

    clearLocalStorage() {
        try {
            localStorage.removeItem('visaFormData');
            console.log('🗑️ Datos de localStorage limpiados');
        } catch (error) {
            console.error('❌ Error limpiando localStorage:', error);
        }
    }

    hasLocalStorageData() {
        try {
            const data = localStorage.getItem('visaFormData');
            return data !== null && data !== '{}';
        } catch (error) {
            return false;
        }
    }

    // Guardar datos del paso actual - VERSIÓN MEJORADA
    saveCurrentStepData() {
        // PREVENIR guardado durante la restauración
        if (this.isRestoringData) {
            console.log('⏸️ Guardado pausado durante restauración');
            return false;
        }

        const currentStep = this.formSteps[this.currentStep];
        if (!currentStep) return;

        const stepData = {};
        const inputs = currentStep.querySelectorAll('input, select, textarea');

        let hasRealData = false;

        inputs.forEach(input => {
            if (input.type === 'radio') {
                const selectedRadio = currentStep.querySelector(`input[name="${input.name}"]:checked`);
                if (selectedRadio && selectedRadio.value) {
                    stepData[input.name] = selectedRadio.value;
                    hasRealData = true;
                }
            } else if (input.type === 'checkbox') {
                if (input.checked) {
                    stepData[input.name] = true;
                    hasRealData = true;
                }
            } else {
                if (input.value) {
                    stepData[input.name] = input.value;
                    hasRealData = true;
                }
            }
        });

        // SOLO guardar si hay datos reales
        if (hasRealData) {
            // El CookieManager ahora filtra automáticamente los valores inválidos
            let success = this.cookieManager.saveStepData(this.currentStep + 1, stepData);

            // FALLBACK a localStorage si las cookies fallan
            if (!success) {
                console.log('🔄 Intentando fallback a localStorage...');
                success = this.saveToLocalStorage(this.currentStep + 1, stepData);
            }

            if (success) {
                console.log(`💾 Paso ${this.currentStep + 1} guardado:`, stepData);
                this.hasJustSaved = true;

                setTimeout(() => {
                    this.hasJustSaved = false;
                }, 1000);
            }
            return success;
        } else {
            console.log(`⏭️ Paso ${this.currentStep + 1} sin datos reales, no se guarda`);
            return false;
        }
    }

    async loadCountriesFromAPI() {
        try {
            console.log('🌍 Cargando países desde REST Countries API...');

            // Mostrar estado de carga
            this.updateCountrySelects('Cargando países...');

            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,translations');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const countries = await response.json();

            console.log(`✅ ${countries.length} países cargados correctamente`);

            // Ordenar países alfabéticamente por nombre en español
            countries.sort((a, b) => {
                const nameA = a.translations?.spa?.common || a.name.common;
                const nameB = b.translations?.spa?.common || b.name.common;
                return nameA.localeCompare(nameB);
            });

            this.populateCountrySelects(countries);
            console.log('✅ Países listos para usar');

        } catch (error) {
            console.error('❌ Error cargando países desde API:', error);
            this.showNotification('Error cargando países. Usando lista local.', 'error');
            this.loadLocalCountries();
        }
    }

    updateCountrySelects(message) {
        const countrySelects = document.querySelectorAll(`
            select[id="birthCountry"],
            select[id="nationality"],
            select[id="passportIssuingCountry"], 
            select[id="country"]
        `);

        countrySelects.forEach(select => {
            select.innerHTML = `<option value="">${message}</option>`;
        });
    }

    populateCountrySelects(countries) {
        const countrySelects = document.querySelectorAll(`
            select[id="birthCountry"],
            select[id="nationality"],
            select[id="passportIssuingCountry"], 
            select[id="country"]
        `);

        console.log(`🌍 Poblando ${countrySelects.length} selects de países...`);

        countrySelects.forEach((select, index) => {
            console.log(`📝 Procesando select ${index + 1}: ${select.id}`);

            // Solo inicializar si no tiene opciones ya
            if (select.options.length <= 1 || select.options[0].text.includes('Cargando')) {
                select.innerHTML = '<option value="">Seleccionar país...</option>';

                countries.forEach(country => {
                    const option = document.createElement('option');

                    const countryName = country.translations?.spa?.common || country.name.common;
                    const countryCode = country.cca3 || country.cca2;

                    option.value = countryCode;
                    option.textContent = countryName;

                    // Agregar bandera emoji si está disponible
                    if (country.cca2) {
                        const flag = this.getCountryFlag(country.cca2);
                        if (flag) {
                            option.textContent = `${flag} ${countryName}`;
                        }
                    }

                    select.appendChild(option);
                });

                console.log(`✅ Select ${select.id} poblado con ${countries.length} países`);
            }

            // Agregar evento change
            select.addEventListener('change', () => {
                this.handleCountrySelection(select);
                this.saveCurrentStepData();
            });
        });
    }

    getCountryFlag(countryCode) {
        // Convertir código de país a emoji de bandera
        if (!countryCode || countryCode.length !== 2) return '';

        try {
            return countryCode.toUpperCase().replace(/./g,
                char => String.fromCodePoint(127397 + char.charCodeAt())
            );
        } catch (error) {
            return '';
        }
    }

    handleCountrySelection(select) {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.value) {
            console.log(`País seleccionado: ${selectedOption.textContent}`);
        }
    }

    loadLocalCountries() {
        console.log('📋 Cargando lista local de países...');

        const localCountries = [
            { cca3: 'USA', name: { common: 'United States' }, translations: { spa: { common: 'Estados Unidos' } } },
            { cca3: 'MEX', name: { common: 'Mexico' }, translations: { spa: { common: 'México' } } },
            { cca3: 'CAN', name: { common: 'Canada' }, translations: { spa: { common: 'Canadá' } } },
            { cca3: 'ESP', name: { common: 'Spain' }, translations: { spa: { common: 'España' } } },
            { cca3: 'COL', name: { common: 'Colombia' }, translations: { spa: { common: 'Colombia' } } },
            { cca3: 'ARG', name: { common: 'Argentina' }, translations: { spa: { common: 'Argentina' } } },
            { cca3: 'PER', name: { common: 'Peru' }, translations: { spa: { common: 'Perú' } } },
            { cca3: 'CHL', name: { common: 'Chile' }, translations: { spa: { common: 'Chile' } } },
            { cca3: 'BRA', name: { common: 'Brazil' }, translations: { spa: { common: 'Brasil' } } },
            { cca3: 'FRA', name: { common: 'France' }, translations: { spa: { common: 'Francia' } } },
            { cca3: 'DEU', name: { common: 'Germany' }, translations: { spa: { common: 'Alemania' } } },
            { cca3: 'ITA', name: { common: 'Italy' }, translations: { spa: { common: 'Italia' } } },
            { cca3: 'GBR', name: { common: 'United Kingdom' }, translations: { spa: { common: 'Reino Unido' } } },
            { cca3: 'CHN', name: { common: 'China' }, translations: { spa: { common: 'China' } } },
            { cca3: 'JPN', name: { common: 'Japan' }, translations: { spa: { common: 'Japón' } } },
            { cca3: 'IND', name: { common: 'India' }, translations: { spa: { common: 'India' } } },
            { cca3: 'RUS', name: { common: 'Russia' }, translations: { spa: { common: 'Rusia' } } },
            { cca3: 'AUS', name: { common: 'Australia' }, translations: { spa: { common: 'Australia' } } }
        ];

        this.populateCountrySelects(localCountries);
    }

    showStep(stepIndex) {
        // Guardar datos del paso actual antes de cambiar
        this.saveCurrentStepData();

        // Ocultar todos los pasos
        this.formSteps.forEach(step => step.classList.remove('active'));
        this.progressSteps.forEach(step => {
            step.classList.remove('active', 'completed');
        });

        // Mostrar paso actual
        if (this.formSteps[stepIndex]) {
            this.formSteps[stepIndex].classList.add('active');
        }

        // Actualizar progreso
        this.progressSteps.forEach((step, index) => {
            if (index < stepIndex) {
                step.classList.add('completed');
            } else if (index === stepIndex) {
                step.classList.add('active');
            }
        });

        this.currentStep = stepIndex;
        this.updateButtons();

        // Si es el último paso, mostrar resumen
        if (stepIndex === this.formSteps.length - 1) {
            this.showFormReview();
        }

        // Scroll to top del formulario
        this.scrollToFormTop();
    }

    scrollToFormTop() {
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateButtons() {
        // Actualizar botón anterior
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentStep === 0;
            this.prevBtn.style.display = this.currentStep === 0 ? 'none' : 'inline-block';
        }

        // Actualizar botones siguiente/enviar
        if (this.currentStep === this.formSteps.length - 1) {
            // Último paso - mostrar botón de enviar y ocultar siguiente
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            if (this.submitBtn) this.submitBtn.style.display = 'inline-block';
        } else {
            // No es el último paso - mostrar botón siguiente y ocultar enviar
            if (this.nextBtn) {
                this.nextBtn.style.display = 'inline-block';
                this.nextBtn.textContent = 'Siguiente';
            }
            if (this.submitBtn) this.submitBtn.style.display = 'none';
        }

        console.log(`Paso actual: ${this.currentStep + 1}, Total pasos: ${this.formSteps.length}`);
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.saveCurrentStepData(); // Guardar antes de retroceder
            this.showStep(this.currentStep - 1);
        }
    }

    nextStep() {
        if (this.currentStep < this.formSteps.length - 1) {
            if (this.validateStep(this.currentStep)) {
                this.saveCurrentStepData(); // Guardar antes de avanzar
                this.showStep(this.currentStep + 1);
            }
        }
    }

    validateStep(stepIndex) {
        const currentStep = this.formSteps[stepIndex];
        if (!currentStep) return false;

        const inputs = currentStep.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Por favor completa todos los campos requeridos correctamente', 'error');
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');

        // Si no es requerido y está vacío, es válido
        if (!isRequired && !value) {
            field.style.borderColor = '#ddd';
            return true;
        }

        // Si es requerido y está vacío, es inválido
        if (isRequired && !value) {
            field.style.borderColor = '#e55039';
            this.showFieldError(field, 'Este campo es requerido');
            return false;
        }

        // Validaciones específicas por tipo de campo
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

        // Validación específica para campos de selección
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

        // Validación para fechas de pasaporte
        if (dateField.id === 'passportExpiryDate') {
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(today.getMonth() + 6);
            return date > sixMonthsFromNow;
        }

        // Validación para fecha de nacimiento (no puede ser en el futuro)
        if (dateField.id === 'birthDate') {
            return date <= today;
        }

        return !isNaN(date.getTime());
    }

    isValidPassportNumber(passportNumber) {
        const passportRegex = /^[A-Z0-9]{6,9}$/;
        return passportRegex.test(passportNumber);
    }

    showFormReview() {
        const formData = new FormData(document.getElementById('visa-form'));
        const reviewContainer = document.getElementById('form-review');

        if (!reviewContainer) return;

        let reviewHTML = `
            <div class="form-review-section">
                <h4>Información Personal</h4>
                <div class="review-item"><strong>Nombre completo:</strong> ${formData.get('firstName')} ${formData.get('lastName')}</div>
                <div class="review-item"><strong>Nombre en idioma nativo:</strong> ${formData.get('fullNameNative') || 'No proporcionado'}</div>
                <div class="review-item"><strong>Fecha de nacimiento:</strong> ${this.formatDate(formData.get('birthDate'))}</div>
                <div class="review-item"><strong>Lugar de nacimiento:</strong> ${formData.get('birthCity')}, ${this.getSelectedText('birthCountry')}</div>
                <div class="review-item"><strong>Nacionalidad:</strong> ${this.getSelectedText('nationality')}</div>
                <div class="review-item"><strong>Sexo:</strong> ${formData.get('gender')}</div>
                <div class="review-item"><strong>Estado civil:</strong> ${formData.get('maritalStatus')}</div>
            </div>

            <div class="form-review-section">
                <h4>Información de Pasaporte</h4>
                <div class="review-item"><strong>Número de pasaporte:</strong> ${formData.get('passportNumber')}</div>
                <div class="review-item"><strong>Fecha de emisión:</strong> ${this.formatDate(formData.get('passportIssuanceDate'))}</div>
                <div class="review-item"><strong>Fecha de expiración:</strong> ${this.formatDate(formData.get('passportExpiryDate'))}</div>
                <div class="review-item"><strong>País emisor:</strong> ${this.getSelectedText('passportIssuingCountry')}</div>
                <div class="review-item"><strong>Autoridad emisora:</strong> ${formData.get('passportIssuingAuthority')}</div>
                <div class="review-item"><strong>Pasaporte perdido/robado:</strong> ${formData.get('lostPassport') === 'yes' ? 'Sí' : 'No'}</div>
            </div>

            <div class="form-review-section">
                <h4>Información de Contacto</h4>
                <div class="review-item"><strong>Dirección:</strong> ${formData.get('homeAddress')}</div>
                <div class="review-item"><strong>Ciudad:</strong> ${formData.get('city')}</div>
                <div class="review-item"><strong>Estado/Provincia:</strong> ${formData.get('state')}</div>
                <div class="review-item"><strong>Código Postal:</strong> ${formData.get('zipCode')}</div>
                <div class="review-item"><strong>País:</strong> ${this.getSelectedText('country')}</div>
                <div class="review-item"><strong>Teléfono principal:</strong> ${formData.get('phone')}</div>
                <div class="review-item"><strong>Teléfono secundario:</strong> ${formData.get('secondaryPhone') || 'No proporcionado'}</div>
                <div class="review-item"><strong>Email:</strong> ${formData.get('email')}</div>
            </div>

            <div class="form-review-section">
                <h4>Detalles del Viaje</h4>
                <div class="review-item"><strong>Tipo de visa:</strong> ${formData.get('visaType')}</div>
                <div class="review-item"><strong>Propósito del viaje:</strong> ${formData.get('purpose')}</div>
                <div class="review-item"><strong>Fecha de llegada estimada:</strong> ${this.formatDate(formData.get('intendedArrivalDate'))}</div>
                <div class="review-item"><strong>Fecha de salida estimada:</strong> ${this.formatDate(formData.get('intendedDepartureDate'))}</div>
                <div class="review-item"><strong>Duración estimada:</strong> ${formData.get('duration')}</div>
                <div class="review-item"><strong>Dirección en EE.UU.:</strong> ${formData.get('usAddress')}</div>
                <div class="review-item"><strong>¿Ha visitado EE.UU. antes?:</strong> ${formData.get('visitedUS') === 'yes' ? 'Sí' : 'No'}</div>
            </div>
        `;

        // Información de contacto en EE.UU.
        if (formData.get('usContactName')) {
            reviewHTML += `
                <div class="form-review-section">
                    <h4>Contacto en Estados Unidos</h4>
                    <div class="review-item"><strong>Nombre del contacto:</strong> ${formData.get('usContactName')}</div>
                    <div class="review-item"><strong>Organización:</strong> ${formData.get('usContactOrganization') || 'No especificada'}</div>
                    <div class="review-item"><strong>Relación:</strong> ${formData.get('usContactRelationship')}</div>
                    <div class="review-item"><strong>Dirección:</strong> ${formData.get('usContactAddress')}</div>
                    <div class="review-item"><strong>Teléfono:</strong> ${formData.get('usContactPhone') || 'No proporcionado'}</div>
                    <div class="review-item"><strong>Email:</strong> ${formData.get('usContactEmail') || 'No proporcionado'}</div>
                </div>
            `;
        }

        reviewHTML += `
            <div class="form-review-section">
                <h4>Antecedentes Familiares</h4>
                <div class="review-item"><strong>Nombre del padre:</strong> ${formData.get('fatherName') || 'No proporcionado'}</div>
                <div class="review-item"><strong>Nombre de la madre:</strong> ${formData.get('motherName') || 'No proporcionado'}</div>
                <div class="review-item"><strong>¿Familiar en EE.UU.?:</strong> ${formData.get('usRelative') === 'yes' ? 'Sí' : 'No'}</div>
        `;

        if (formData.get('usRelative') === 'yes') {
            reviewHTML += `
                <div class="review-item"><strong>Nombre del familiar:</strong> ${formData.get('usRelativeName')}</div>
                <div class="review-item"><strong>Parentesco:</strong> ${formData.get('usRelativeRelationship')}</div>
                <div class="review-item"><strong>Estatus:</strong> ${formData.get('usRelativeStatus')}</div>
            `;
        }

        reviewHTML += `</div>`;

        reviewHTML += `
            <div class="form-review-section">
                <h4>Empleo y Educación</h4>
                <div class="review-item"><strong>Ocupación:</strong> ${formData.get('occupation')}</div>
                <div class="review-item"><strong>Empleador/Escuela:</strong> ${formData.get('employerName')}</div>
                <div class="review-item"><strong>Dirección del empleador:</strong> ${formData.get('employerAddress')}</div>
                <div class="review-item"><strong>Ciudad:</strong> ${formData.get('employerCity')}</div>
                <div class="review-item"><strong>Teléfono del empleador:</strong> ${formData.get('employerPhone')}</div>
                <div class="review-item"><strong>Ingreso mensual:</strong> ${formData.get('monthlyIncome')}</div>
                <div class="review-item"><strong>Nivel de educación:</strong> ${formData.get('educationLevel')}</div>
            </div>

            <div class="form-review-section">
                <h4>Seguridad y Antecedentes</h4>
                <div class="review-item"><strong>Problemas de salud:</strong> ${formData.get('healthDisorder') === 'yes' ? 'Sí' : 'No'}</div>
                <div class="review-item"><strong>Adicción a drogas:</strong> ${formData.get('drugAddiction') === 'yes' ? 'Sí' : 'No'}</div>
                <div class="review-item"><strong>Antecedentes penales:</strong> ${formData.get('criminal') === 'yes' ? 'Sí' : 'No'}</div>
                <div class="review-item"><strong>Violación de leyes migratorias:</strong> ${formData.get('immigrationViolation') === 'yes' ? 'Sí' : 'No'}</div>
                <div class="review-item"><strong>Actividades terroristas:</strong> ${formData.get('terrorism') === 'yes' ? 'Sí' : 'No'}</div>
                <div class="review-item"><strong>Fraude de visa:</strong> ${formData.get('visaFraud') === 'yes' ? 'Sí' : 'No'}</div>
                <div class="review-item"><strong>Información adicional:</strong> ${formData.get('additionalSecurityInfo') || 'Ninguna'}</div>
            </div>
        `;

        reviewContainer.innerHTML = reviewHTML;

        // Agregar botón para agregar recordatorio al calendario
        const calendarButton = document.createElement('button');
        calendarButton.type = 'button';
        calendarButton.className = 'calendar-btn';
        calendarButton.innerHTML = '<i class="bi bi-calendar-plus"></i> Agregar Recordatorio de Entrevista';
        calendarButton.onclick = () => this.addInterviewReminder();

        reviewContainer.appendChild(calendarButton);
    }

    getSelectedText(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return '';

        const selectedOption = select.options[select.selectedIndex];
        if (!selectedOption) return '';

        // Remover emoji de bandera si existe para mostrar solo el nombre
        const text = selectedOption.textContent;
        return text.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '').trim();
    }

    formatDate(dateString) {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }

    addInterviewReminder() {
        const formData = new FormData(document.getElementById('visa-form'));
        const fullName = `${formData.get('firstName')} ${formData.get('lastName')}`;

        const eventDetails = {
            summary: `Entrevista de Visa - ${fullName}`,
            description: `Entrevista para visa ${formData.get('visaType')}. Recuerda llevar todos los documentos requeridos.`,
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hora de duración
            location: 'Embajada o Consulado de EE.UU.'
        };

        // Usar CalendarService si está disponible
        if (window.CalendarService && typeof window.CalendarService.addEvent === 'function') {
            window.CalendarService.addEvent(eventDetails)
                .then(() => {
                    this.showNotification('Recordatorio agregado al calendario', 'success');
                })
                .catch(error => {
                    console.error('Error adding calendar event:', error);
                    this.showNotification('Error al agregar recordatorio', 'error');
                });
        } else {
            this.showNotification('Función de calendario no disponible', 'info');
        }
    }

    async submitForm() {
        // Validar checkboxes de certificación
        const certifyTruthful = document.getElementById('certifyTruthful');
        const understandPenalties = document.getElementById('understandPenalties');
        const authorizeUse = document.getElementById('authorizeUse');

        if (!certifyTruthful || !certifyTruthful.checked ||
            !understandPenalties || !understandPenalties.checked ||
            !authorizeUse || !authorizeUse.checked) {
            this.showNotification('Debes aceptar todas las certificaciones para enviar la solicitud', 'error');
            return;
        }

        if (!this.validateStep(this.currentStep)) {
            this.showNotification('Por favor corrige los errores antes de enviar', 'error');
            return;
        }

        try {
            this.showNotification('Enviando solicitud de visa a la base de datos...', 'info');

            // Recopilar datos del formulario
            const formData = new FormData(document.getElementById('visa-form'));
            const formObject = Object.fromEntries(formData.entries());

            console.log('📤 Datos del formulario a enviar:', formObject);

            // 🔥 NUEVO: ENVIAR A GOOGLE SHEETS
            if (window.googleSheetsService) {
                const result = await window.googleSheetsService.saveFormData(formObject);

                if (result.success) {
                    this.showNotification('¡Solicitud de visa guardada en la base de datos!', 'success');

                    // LIMPIAR DATOS LOCALES después del envío exitoso
                    this.cookieManager.clearFormData();
                    this.clearLocalStorage();

                    // Actualizar progreso del usuario
                    if (window.visaHelperApp) {
                        window.visaHelperApp.userProgress.forms++;
                        window.visaHelperApp.userProgress.overall = Math.min(
                            window.visaHelperApp.userProgress.overall + 10,
                            100
                        );
                        window.visaHelperApp.updateProgressUI();
                        localStorage.setItem('visaHelperProgress', JSON.stringify(window.visaHelperApp.userProgress));
                    }

                    // Redirigir al dashboard después de 3 segundos
                    setTimeout(() => {
                        window.location.hash = '#dashboard';
                        if (document.getElementById('dashboard')) {
                            document.getElementById('dashboard').classList.add('active');
                        }
                        if (document.getElementById('forms')) {
                            document.getElementById('forms').classList.remove('active');
                        }

                        // Resetear formulario
                        document.getElementById('visa-form').reset();
                        this.showStep(0);

                        // Ocultar botón de limpiar datos
                        const clearDataBtn = document.getElementById('clear-data-btn');
                        if (clearDataBtn) {
                            clearDataBtn.style.display = 'none';
                        }
                    }, 3000);

                } else {
                    throw new Error(result.error || 'Error desconocido al guardar');
                }
            } else {
                throw new Error('Servicio de Google Sheets no disponible');
            }

        } catch (error) {
            console.error('Error enviando formulario a Google Sheets:', error);
            this.showNotification('Error al enviar la solicitud: ' + error.message, 'error');

            // Fallback: guardar localmente
            this.showNotification('Guardando localmente como respaldo...', 'warning');
            const submissions = JSON.parse(localStorage.getItem('visaSubmissions') || '[]');
            submissions.push({
                ...formObject,
                submissionDate: new Date().toISOString(),
                status: 'pending_retry'
            });
            localStorage.setItem('visaSubmissions', JSON.stringify(submissions));
        }
    }

    showNotification(message, type = 'info') {
        // Eliminar notificación existente si hay una
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="bi bi-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'info': 'info-circle',
            'warning': 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    showAutoSaveNotification() {
        // Mostrar un indicador sutil de guardado automático
        const existingIndicator = document.querySelector('.auto-save-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const indicator = document.createElement('div');
        indicator.className = 'auto-save-indicator';
        indicator.innerHTML = '<i class="bi bi-check-circle"></i> Guardado automáticamente';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #78e08f;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        document.body.appendChild(indicator);

        // Animación de entrada
        setTimeout(() => indicator.style.opacity = '1', 10);

        // Auto-remover después de 2 segundos
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }, 2000);
    }

    // ===== MÉTODOS DE UTILIDAD =====

    quickTest() {
        console.log('🧪 PRUEBA RÁPIDA - Instrucciones:');
        console.log('1. Haz clic en el select "País de Nacimiento"');
        console.log('2. Escribe la letra "m" (debería seleccionar México)');
        console.log('3. Escribe "a" después de "m" (debería buscar "ma")');
        console.log('4. Usa Backspace para borrar letras');
        console.log('');
        console.log('🔧 Si no funciona, ejecuta: formManager.fixKeyboardSearch()');
        console.log('🔍 Para diagnóstico completo: formManager.runComprehensiveDiagnosis()');
    }

}

// ===== INICIALIZACIÓN DEL FORMULARIO =====
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (document.getElementById('visa-form')) {
            window.formManager = new FormManager();

            // Hacer disponible el diagnóstico globalmente
            window.diagnoseForm = function () {
                window.formManager.runComprehensiveDiagnosis();
            };

            window.fixSearch = function () {
                window.formManager.fixKeyboardSearch();
            };

            window.quickTest = function () {
                window.formManager.quickTest();
            };

            console.log('🎯 FormManager inicializado');
            console.log('🔧 Comandos disponibles:');
            console.log('   • diagnoseForm() - Diagnóstico completo');
            console.log('   • fixSearch() - Reparar búsqueda');
            console.log('   • quickTest() - Instrucciones de prueba');
        }
    }, 100);
});

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
                    const translatedText = await TranslationService.translateText(originalText, 'en');
                    
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

    static showNotification(message, type = 'info') {
        // Reutilizar el sistema de notificaciones existente
        if (window.formManager && window.formManager.showNotification) {
            window.formManager.showNotification(message, type);
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
// ===== UTILIDADES DEL FORMULARIO =====
export class FormUtils {
    static isDataEmpty(savedData) {
        for (let stepKey in savedData) {
            if (stepKey.startsWith('step_')) {
                const stepData = savedData[stepKey];
                for (let fieldName in stepData) {
                    if (stepData[fieldName] && stepData[fieldName] !== '') {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    static populateFormWithSavedData(savedData, cookieManager) {
        console.log('🔧 INICIANDO RESTAURACIÓN DE DATOS...');
        let restoredCount = 0;

        Object.keys(savedData).forEach(stepKey => {
            if (stepKey.startsWith('step_')) {
                const stepData = savedData[stepKey];
                console.log(`🔧 Restaurando ${stepKey}:`, stepData);

                Object.keys(stepData).forEach(fieldName => {
                    const field = document.querySelector(`[name="${fieldName}"]`);
                    if (field) {
                        const value = stepData[fieldName];

                        if (value && value !== '' && value !== null && value !== undefined && value !== 'undefined') {
                            if (field.type === 'radio') {
                                const radioToCheck = document.querySelector(`[name="${fieldName}"][value="${value}"]`);
                                if (radioToCheck) {
                                    radioToCheck.checked = true;
                                    restoredCount++;
                                    console.log(`✅ Radio seleccionado: ${fieldName} = ${value}`);
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

        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn && (cookieManager.hasSavedData() || this.hasLocalStorageData())) {
            clearDataBtn.style.display = 'inline-block';
        }
    }

    static setSelectValue(selectElement, value) {
        if (!value && value !== '') {
            console.log(`⏭️ Select ${selectElement.name}: valor vacío, omitiendo`);
            return false;
        }

        if (value === undefined || value === 'undefined') {
            console.log(`⏭️ Select ${selectElement.name}: valor undefined, omitiendo`);
            return false;
        }

        console.log(`🔧 Estableciendo select ${selectElement.name} = ${value}`);
        selectElement.value = value;

        if (selectElement.value === value) {
            console.log(`✅ Select ${selectElement.name} establecido directamente`);
            return true;
        }

        console.log(`🔍 Buscando alternativa para select ${selectElement.name}...`);
        for (let option of selectElement.options) {
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

    static collectStepData(currentStep) {
        const stepData = {};
        const inputs = currentStep.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.type === 'radio') {
                const selectedRadio = currentStep.querySelector(`input[name="${input.name}"]:checked`);
                if (selectedRadio && selectedRadio.value) {
                    stepData[input.name] = selectedRadio.value;
                }
            } else if (input.type === 'checkbox') {
                if (input.checked) {
                    stepData[input.name] = true;
                }
            } else {
                if (input.value) {
                    stepData[input.name] = input.value;
                }
            }
        });

        return stepData;
    }

    static hasRealData(stepData) {
        return Object.keys(stepData).length > 0;
    }

    static saveToLocalStorage(stepNumber, stepData) {
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

    static loadFromLocalStorage() {
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

    static clearLocalStorage() {
        try {
            localStorage.removeItem('visaFormData');
            console.log('🗑️ Datos de localStorage limpiados');
        } catch (error) {
            console.error('❌ Error limpiando localStorage:', error);
        }
    }

    static hasLocalStorageData() {
        try {
            const data = localStorage.getItem('visaFormData');
            return data !== null && data !== '{}';
        } catch (error) {
            return false;
        }
    }
}

export class DateUtils {
    static formatDate(dateString) {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }

    static isValidDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    static isFutureDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date > today;
    }

    static isPastDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date < today;
    }
}
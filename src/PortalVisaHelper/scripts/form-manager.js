// ===== GESTIÓN DE FORMULARIOS =====

class FormManager {
constructor() {
    this.currentStep = 0;
    this.formSteps = document.querySelectorAll('.form-step');
    this.progressSteps = document.querySelectorAll('.progress-step');
    
    // Los botones ahora están fuera de los steps, así que los buscamos directamente
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.submitBtn = document.getElementById('submit-btn');
    
    console.log('Elementos encontrados:', {
        formSteps: this.formSteps.length,
        prevBtn: !!this.prevBtn,
        nextBtn: !!this.nextBtn,
        submitBtn: !!this.submitBtn
    });
    
    this.init();
}

    init() {
        this.setupEventListeners();
        this.setupConditionalLogic();
        this.loadCountriesFromAPI(); // Cambiado a la API de REST Countries
        this.showStep(0);
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
            });
        });

        // Mostrar/ocultar detalles de pasaporte perdido
        document.querySelectorAll('input[name="lostPassport"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                // Aquí se puede agregar lógica adicional si es necesario
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
            });
        });
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
            this.showNotification('Lista de países cargada correctamente', 'success');
            
        } catch (error) {
            console.error('❌ Error cargando países desde API:', error);
            this.showNotification('Error cargando países. Usando lista local.', 'error');
            this.loadLocalCountries();
        }
    }

    updateCountrySelects(message) {
        const countrySelects = document.querySelectorAll('select[id$="Country"], select[name="country"], select[name="nationality"], select[name="passportIssuingCountry"]');
        
        countrySelects.forEach(select => {
            select.innerHTML = `<option value="">${message}</option>`;
        });
    }

    populateCountrySelects(countries) {
        const countrySelects = document.querySelectorAll('select[id$="Country"], select[name="country"], select[name="nationality"], select[name="passportIssuingCountry"]');
        
        countrySelects.forEach(select => {
            // Solo inicializar si no tiene opciones ya (excepto el mensaje de carga)
            if (select.options.length <= 1 || select.options[0].text.includes('Cargando')) {
                select.innerHTML = '<option value="">Seleccionar país...</option>';
                
                countries.forEach(country => {
                    const option = document.createElement('option');
                    
                    // Usar nombre en español si está disponible, sino usar nombre común en inglés
                    const countryName = country.translations?.spa?.common || country.name.common;
                    const countryCode = country.cca3 || country.cca2;
                    
                    option.value = countryCode;
                    option.textContent = countryName;
                    option.setAttribute('data-english-name', country.name.common);
                    
                    // Agregar bandera emoji si está disponible (usando código de país)
                    if (country.cca2) {
                        const flag = this.getCountryFlag(country.cca2);
                        if (flag) {
                            option.textContent = `${flag} ${countryName}`;
                        }
                    }
                    
                    select.appendChild(option);
                });
                
                // Agregar evento para traducción si es necesario
                select.addEventListener('change', () => {
                    this.handleCountrySelection(select);
                });
            }
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
            const englishName = selectedOption.getAttribute('data-english-name');
            console.log(`País seleccionado: ${selectedOption.textContent} (${englishName})`);
            
            // Aquí puedes agregar lógica adicional cuando se selecciona un país
            // Por ejemplo, actualizar otros campos o hacer traducciones
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
    console.log(`Siguiente visible: ${this.nextBtn?.style.display}, Enviar visible: ${this.submitBtn?.style.display}`);
}

    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    nextStep() {
        if (this.currentStep < this.formSteps.length - 1) {
            if (this.validateStep(this.currentStep)) {
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

        switch(field.type) {
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
            this.showNotification('Enviando solicitud de visa...', 'info');
            
            // Simular procesamiento
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Recopilar datos del formulario
            const formData = new FormData(document.getElementById('visa-form'));
            const formObject = Object.fromEntries(formData.entries());
            
            // Guardar en localStorage (simulación)
            const submissions = JSON.parse(localStorage.getItem('visaSubmissions') || '[]');
            submissions.push({
                ...formObject,
                submissionDate: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('visaSubmissions', JSON.stringify(submissions));
            
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

            this.showNotification('¡Solicitud de visa enviada correctamente!', 'success');
            
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
            }, 3000);

        } catch (error) {
            console.error('Error enviando formulario:', error);
            this.showNotification('Error al enviar la solicitud. Por favor intenta nuevamente.', 'error');
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
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// ===== INICIALIZACIÓN DEL FORMULARIO =====
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que el DOM esté completamente cargado
    setTimeout(() => {
        if (document.getElementById('visa-form')) {
            window.formManager = new FormManager();
        }
    }, 100);
});
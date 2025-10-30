// ===== MÓDULO DE GESTIÓN DE PAÍSES =====
export class CountryManager {
    constructor(formManager) {
        this.formManager = formManager;
        this.countries = [];
    }

    async loadCountriesFromAPI() {
        try {
            console.log('🌍 Cargando países desde REST Countries API...');
            this.updateCountrySelects('Cargando países...');

            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,translations');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            this.countries = await response.json();
            console.log(`✅ ${this.countries.length} países cargados correctamente`);

            // Ordenar países alfabéticamente
            this.countries.sort((a, b) => {
                const nameA = a.translations?.spa?.common || a.name.common;
                const nameB = b.translations?.spa?.common || b.name.common;
                return nameA.localeCompare(nameB);
            });

            this.populateCountrySelects();
            console.log('✅ Países listos para usar');

        } catch (error) {
            console.error('❌ Error cargando países desde API:', error);
            this.formManager.notificationManager.show('Error cargando países. Usando lista local.', 'error');
            this.loadLocalCountries();
        }
    }

    updateCountrySelects(message) {
        const countrySelects = this.getCountrySelects();
        countrySelects.forEach(select => {
            select.innerHTML = `<option value="">${message}</option>`;
        });
    }

    populateCountrySelects() {
        const countrySelects = this.getCountrySelects();
        console.log(`🌍 Poblando ${countrySelects.length} selects de países...`);

        countrySelects.forEach((select, index) => {
            console.log(`📝 Procesando select ${index + 1}: ${select.id}`);

            if (select.options.length <= 1 || select.options[0].text.includes('Cargando')) {
                select.innerHTML = '<option value="">Seleccionar país...</option>';

                this.countries.forEach(country => {
                    const option = document.createElement('option');
                    const countryName = country.translations?.spa?.common || country.name.common;
                    const countryCode = country.cca3 || country.cca2;

                    option.value = countryCode;
                    option.textContent = countryName;

                    // Agregar bandera emoji
                    if (country.cca2) {
                        const flag = this.getCountryFlag(country.cca2);
                        if (flag) {
                            option.textContent = `${flag} ${countryName}`;
                        }
                    }

                    select.appendChild(option);
                });

                console.log(`✅ Select ${select.id} poblado con ${this.countries.length} países`);
            }

            select.addEventListener('change', () => {
                this.handleCountrySelection(select);
                this.formManager.saveCurrentStepData();
            });
        });
    }

    getCountrySelects() {
        return document.querySelectorAll(`
            select[id="birthCountry"],
            select[id="nationality"],
            select[id="passportIssuingCountry"], 
            select[id="country"]
        `);
    }

    getCountryFlag(countryCode) {
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
            { cca3: 'BRA', name: { common: 'Brazil' }, translations: { spa: { common: 'Brasil' } } }
        ];

        this.countries = localCountries;
        this.populateCountrySelects();
    }

    setupAllCountrySelects() {
        console.log('🔧 Configurando búsqueda para todos los selects...');
        this.setupReliableKeyboardSearch();
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
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            if (['Tab', 'Escape', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

            if (e.key === 'Backspace') {
                e.preventDefault();
                searchString = searchString.slice(0, -1);
                console.log(`🔍 [${selectElement.id}] Borrado: "${searchString}"`);
                this.performSearch(selectElement, searchString);
                this.resetSearchTimeout(timeoutId, () => { searchString = ''; });
                return;
            }

            if (e.key.length === 1 && /[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]/i.test(e.key)) {
                e.preventDefault();
                searchString += e.key.toLowerCase();
                console.log(`🔍 [${selectElement.id}] Buscando: "${searchString}"`);

                this.performSearch(selectElement, searchString);
                timeoutId = this.resetSearchTimeout(timeoutId, () => { searchString = ''; });
            }
        });

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

    fixKeyboardSearch() {
        console.log('🔧 EJECUTANDO REPARACIÓN DE BÚSQUEDA...');

        const allSelects = this.getCountrySelects();
        allSelects.forEach(select => {
            select.removeAttribute('data-search-enabled');
        });

        setTimeout(() => {
            this.setupReliableKeyboardSearch();
            console.log('✅ REPARACIÓN COMPLETADA');
            this.formManager.notificationManager.show('Búsqueda por teclado reparada', 'success');
        }, 500);
    }
}
// ===== MÓDULO DE DIAGNÓSTICO =====
export class DiagnosisManager {
    constructor(formManager) {
        this.formManager = formManager;
    }

    runComprehensiveDiagnosis() {
        console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO...');

        this.diagnoseCountrySelects();
        this.diagnoseKeyboardSearch();
        this.diagnoseFormSteps();
        this.diagnoseCookieManager();

        console.log('✅ DIAGNÓSTICO COMPLETADO');
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

        const formSteps = this.formManager.getFormSteps();
        const currentStep = this.formManager.getCurrentStep();

        console.log(`   📊 Total pasos: ${formSteps.length}`);
        console.log(`   🎯 Paso actual: ${currentStep + 1}`);

        formSteps.forEach((step, index) => {
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

        const cookieManager = this.formManager.cookieManager;
        const cookieInfo = cookieManager.getCookieInfo();
        const hasData = cookieManager.hasSavedData();

        console.log('   Cookie Manager:', {
            '✅ Soporte': cookieManager.isSupported ? 'SÍ' : '❌ NO',
            '💾 Datos guardados': hasData ? 'SÍ' : 'NO',
            '📊 Pasos guardados': cookieInfo ? cookieInfo.stepsSaved : 0,
            '🕒 Último guardado': cookieInfo ? cookieInfo.lastSave : 'Nunca'
        });
    }

    showDiagnosisSummary() {
        const cookieManager = this.formManager.cookieManager;
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
   • ${cookieManager.hasSavedData() ? '✅ Hay datos guardados' : '⚠️ No hay datos guardados'}

📝 PASOS DEL FORMULARIO:
   • Paso actual: ${this.formManager.getCurrentStep() + 1} de ${this.formManager.getFormSteps().length}

🔧 SOLUCIÓN DE PROBLEMAS:
   • Si la búsqueda no funciona, ejecuta: formManager.fixKeyboardSearch()
   • Para más detalles ejecuta: formManager.diagnosisManager.runComprehensiveDiagnosis()
        `;

        console.log(summary);
    }

    quickTest() {
        console.log('🧪 PRUEBA RÁPIDA - Instrucciones:');
        console.log('1. Haz clic en el select "País de Nacimiento"');
        console.log('2. Escribe la letra "m" (debería seleccionar México)');
        console.log('3. Escribe "a" después de "m" (debería buscar "ma")');
        console.log('4. Usa Backspace para borrar letras');
        console.log('');
        console.log('🔧 Si no funciona, ejecuta: formManager.fixKeyboardSearch()');
        console.log('🔍 Para diagnóstico completo: formManager.diagnosisManager.runComprehensiveDiagnosis()');
    }
}
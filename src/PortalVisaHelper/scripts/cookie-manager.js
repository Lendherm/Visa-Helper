// ===== GESTIÓN DE COOKIES - VERSIÓN 2.0 CON FILTRO DE DATOS =====

class CookieManager {
    constructor() {
        this.cookieName = 'visaFormData';
        this.expirationDays = 30;
        this.isSupported = this.checkSupport();
        
        console.log('🍪 Cookie Manager inicializado:', {
            soporte: this.isSupported,
            nombreCookie: this.cookieName,
            expiración: this.expirationDays + ' días'
        });
    }

    // Verificar soporte de cookies - VERSIÓN MEJORADA
    checkSupport() {
        try {
            // Verificar si document.cookie existe
            if (typeof document.cookie === 'undefined') {
                console.warn('❌ document.cookie no está disponible');
                return false;
            }
            
            // Verificar si podemos escribir y leer una cookie
            const testCookie = 'cookieSupportTest';
            const testValue = 'support_check_' + Date.now();
            const testExpiration = 300; // 5 minutos
            
            // Intentar escribir
            document.cookie = `${testCookie}=${testValue}; max-age=${testExpiration}; path=/; SameSite=Lax`;
            
            // Verificar inmediatamente si se escribió
            const cookies = document.cookie;
            const isSupported = cookies.includes(testCookie);
            
            if (isSupported) {
                console.log('✅ Soporte de cookies verificado correctamente');
            } else {
                console.warn('❌ No se pudo verificar el soporte de cookies');
            }
            
            return isSupported;
            
        } catch (error) {
            console.error('❌ Error verificando soporte de cookies:', error);
            return false;
        }
    }

    // Filtrar datos inválidos antes de guardar
    filterInvalidData(formData) {
        const filteredData = {};
        
        Object.keys(formData).forEach(stepKey => {
            if (stepKey.startsWith('step_')) {
                const stepData = formData[stepKey];
                const filteredStepData = {};
                
                Object.keys(stepData).forEach(fieldName => {
                    const value = stepData[fieldName];
                    
                    // FILTRAR valores inválidos
                    if (value !== undefined && 
                        value !== null && 
                        value !== 'undefined' && 
                        value !== '' &&
                        !(typeof value === 'string' && value.trim() === '')) {
                        
                        filteredStepData[fieldName] = value;
                    } else {
                        console.log(`🚫 Filtrado campo inválido: ${fieldName} =`, value);
                    }
                });
                
                // Solo guardar el paso si tiene datos válidos
                if (Object.keys(filteredStepData).length > 0) {
                    filteredData[stepKey] = filteredStepData;
                } else {
                    console.log(`🚫 Paso ${stepKey} omitido - sin datos válidos`);
                }
            }
        });
        
        return filteredData;
    }

    // Guardar datos del formulario en cookies - VERSIÓN CON FILTRO
    saveFormData(formData) {
        // SIEMPRE intentar guardar, incluso si checkSupport() falló
        try {
            // Filtrar datos antes de guardar
            const filteredData = this.filterInvalidData(formData);
            
            // Si no hay datos válidos después del filtrado, no guardar
            if (Object.keys(filteredData).length === 0) {
                console.log('⏭️ No hay datos válidos para guardar');
                return false;
            }

            const dataToSave = {
                formData: filteredData,
                timestamp: new Date().toISOString(),
                expires: new Date(Date.now() + this.expirationDays * 24 * 60 * 60 * 1000).toISOString(),
                version: '2.0' // Nueva versión con filtrado
            };

            const cookieValue = encodeURIComponent(JSON.stringify(dataToSave));
            const expirationDate = new Date(Date.now() + this.expirationDays * 24 * 60 * 60 * 1000).toUTCString();
            
            document.cookie = `${this.cookieName}=${cookieValue}; expires=${expirationDate}; path=/; SameSite=Lax`;
            
            console.log('💾 Datos guardados en cookies:', {
                pasos: Object.keys(filteredData).length,
                campos: Object.keys(filteredData).reduce((total, step) => total + Object.keys(filteredData[step]).length, 0),
                timestamp: new Date().toLocaleTimeString(),
                version: '2.0'
            });
            
            return true;
        } catch (error) {
            console.error('❌ Error guardando en cookies:', error);
            return false;
        }
    }

    // Cargar datos del formulario desde cookies
    loadFormData() {
        try {
            const name = this.cookieName + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');
            
            for(let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i].trim();
                if (cookie.indexOf(name) === 0) {
                    const cookieData = JSON.parse(cookie.substring(name.length));
                    
                    // Verificar si la cookie ha expirado
                    if (new Date() > new Date(cookieData.expires)) {
                        console.log('🕒 Cookie expirada, limpiando...');
                        this.clearFormData();
                        return null;
                    }
                    
                    console.log('📥 Datos cargados desde cookies:', {
                        pasos: Object.keys(cookieData.formData).length,
                        campos: Object.keys(cookieData.formData).reduce((total, step) => total + Object.keys(cookieData.formData[step]).length, 0),
                        guardado: new Date(cookieData.timestamp).toLocaleString(),
                        version: cookieData.version || '1.0'
                    });
                    
                    return cookieData.formData;
                }
            }
            console.log('ℹ️ No se encontraron datos guardados en cookies');
            return null;
        } catch (error) {
            console.error('❌ Error cargando desde cookies:', error);
            return null;
        }
    }

    // Guardar datos específicos de un paso - VERSIÓN MEJORADA
    saveStepData(stepNumber, stepData) {
        try {
            // Filtrar datos del paso antes de guardar
            const filteredStepData = {};
            
            Object.keys(stepData).forEach(fieldName => {
                const value = stepData[fieldName];
                
                // SOLO guardar valores válidos
                if (value !== undefined && 
                    value !== null && 
                    value !== 'undefined' && 
                    value !== '' &&
                    !(typeof value === 'string' && value.trim() === '')) {
                    
                    filteredStepData[fieldName] = value;
                } else {
                    console.log(`🚫 Campo filtrado en paso ${stepNumber}: ${fieldName} =`, value);
                }
            });
            
            // Si no hay datos válidos después del filtrado, no guardar
            if (Object.keys(filteredStepData).length === 0) {
                console.log(`⏭️ Paso ${stepNumber} sin datos válidos, no se guarda`);
                return false;
            }
            
            const currentData = this.loadFormData() || {};
            currentData[`step_${stepNumber}`] = filteredStepData;
            
            return this.saveFormData(currentData);
        } catch (error) {
            console.error(`❌ Error guardando paso ${stepNumber}:`, error);
            return false;
        }
    }

    // Cargar datos específicos de un paso
    loadStepData(stepNumber) {
        const allData = this.loadFormData();
        return allData ? allData[`step_${stepNumber}`] : null;
    }

    // Limpiar todos los datos
    clearFormData() {
        try {
            document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            console.log('🗑️ Cookies limpiadas');
            return true;
        } catch (error) {
            console.error('❌ Error limpiando cookies:', error);
            return false;
        }
    }

    // Verificar si hay datos guardados
    hasSavedData() {
        return this.loadFormData() !== null;
    }

    // Obtener información de las cookies guardadas
    getCookieInfo() {
        const data = this.loadFormData();
        if (!data) return null;

        const totalFields = Object.keys(data).reduce((total, step) => total + Object.keys(data[step]).length, 0);

        return {
            hasData: true,
            stepsSaved: Object.keys(data).length,
            fieldsSaved: totalFields,
            lastSave: data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Desconocido',
            version: data.version || '1.0',
            supported: this.isSupported
        };
    }

    // Método para migrar datos de versión anterior (opcional)
    migrateFromV1() {
        const currentData = this.loadFormData();
        if (!currentData) return false;
        
        console.log('🔄 Migrando datos de versión anterior...');
        return this.saveFormData(currentData); // Esto aplicará el nuevo filtrado
    }
}

// Limpiar datos corruptos existentes al cargar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const manager = new CookieManager();
        
        // Verificar si hay datos corruptos y limpiarlos
        const currentData = manager.loadFormData();
        if (currentData) {
            let hasCorruptedData = false;
            
            // Buscar valores undefined en los datos
            Object.keys(currentData).forEach(stepKey => {
                const stepData = currentData[stepKey];
                Object.keys(stepData).forEach(fieldName => {
                    const value = stepData[fieldName];
                    if (value === undefined || value === 'undefined') {
                        hasCorruptedData = true;
                        console.log(`⚠️ Dato corrupto encontrado: ${fieldName} = ${value}`);
                    }
                });
            });
            
            if (hasCorruptedData) {
                console.log('🧹 Limpiando datos corruptos existentes...');
                manager.clearFormData();
                console.log('✅ Datos corruptos eliminados');
            }
        }
        
        console.log('🔍 Estado final de cookies:', {
            soporte: manager.isSupported,
            tieneDatos: manager.hasSavedData(),
            info: manager.getCookieInfo()
        });
    }, 1000);
});

// Exportar para uso global
window.CookieManager = CookieManager;
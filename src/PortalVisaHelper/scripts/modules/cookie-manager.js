// ===== MÓDULO DE GESTIÓN DE COOKIES =====
export class CookieManager {
    constructor() {
        this.isSupported = this.checkCookieSupport();
        this.cookieName = 'visaFormData';
        this.expiryDays = 7;
    }

    checkCookieSupport() {
        try {
            document.cookie = 'test=1; SameSite=Lax';
            const supported = document.cookie.indexOf('test=') !== -1;
            document.cookie = 'test=1; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            return supported;
        } catch (error) {
            console.error('Cookie support check failed:', error);
            return false;
        }
    }

    setCookie(name, value, days) {
        if (!this.isSupported) return false;

        try {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = `expires=${date.toUTCString()}`;
            const cookieValue = encodeURIComponent(JSON.stringify(value));
            document.cookie = `${name}=${cookieValue}; ${expires}; path=/; SameSite=Lax`;
            return true;
        } catch (error) {
            console.error('Error setting cookie:', error);
            return false;
        }
    }

    getCookie(name) {
        if (!this.isSupported) return null;

        try {
            const nameEQ = name + '=';
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
                }
            }
            return null;
        } catch (error) {
            console.error('Error getting cookie:', error);
            return null;
        }
    }

    deleteCookie(name) {
        if (!this.isSupported) return;

        try {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        } catch (error) {
            console.error('Error deleting cookie:', error);
        }
    }

    saveStepData(stepNumber, stepData) {
        if (!this.isSupported) return false;

        try {
            // Filtrar valores inválidos antes de guardar
            const filteredData = this.filterInvalidData(stepData);
            
            const currentData = this.getCookie(this.cookieName) || {};
            currentData[`step_${stepNumber}`] = filteredData;
            currentData.lastSave = new Date().toISOString();

            return this.setCookie(this.cookieName, currentData, this.expiryDays);
        } catch (error) {
            console.error('Error saving step data to cookie:', error);
            return false;
        }
    }

    filterInvalidData(data) {
        const filtered = {};
        Object.keys(data).forEach(key => {
            const value = data[key];
            // Solo guardar valores válidos
            if (value !== null && value !== undefined && value !== '' && value !== 'undefined') {
                filtered[key] = value;
            }
        });
        return filtered;
    }

    loadFormData() {
        return this.getCookie(this.cookieName);
    }

    clearFormData() {
        this.deleteCookie(this.cookieName);
        console.log('🗑️ Datos del formulario eliminados de las cookies');
    }

    hasSavedData() {
        const data = this.loadFormData();
        return data !== null && Object.keys(data).length > 0;
    }

    getCookieInfo() {
        const data = this.loadFormData();
        if (!data) return null;

        const steps = Object.keys(data).filter(key => key.startsWith('step_'));
        return {
            stepsSaved: steps.length,
            lastSave: data.lastSave || 'Unknown'
        };
    }
}
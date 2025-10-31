// ES Module: Local Storage Service
export class StorageService {
    static STORAGE_KEYS = {
        USER_PREFERENCES: 'visaUserPreferences',
        FORM_DATA: 'visaFormData',
        SELECTED_COUNTRIES: 'selectedCountries'
    };

    static saveUserPreferences(preferences) {
        try {
            const data = {
                ...preferences,
                lastUpdated: new Date().toISOString(),
                version: '1.0'
            };
            
            localStorage.setItem(this.STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data));
            console.log('💾 User preferences saved:', data);
            this.showStorageIndicator('Preferencias guardadas');
            return true;
        } catch (error) {
            console.error('❌ Error saving user preferences:', error);
            return false;
        }
    }

    static getUserPreferences() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.USER_PREFERENCES);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Error loading user preferences:', error);
            return null;
        }
    }

    static saveFormData(formData) {
        try {
            const data = {
                formData: formData,
                timestamp: new Date().toISOString(),
                step: 'us_visa_form'
            };
            
            localStorage.setItem(this.STORAGE_KEYS.FORM_DATA, JSON.stringify(data));
            console.log('💾 Form data saved');
            this.showStorageIndicator('Progreso guardado');
            return true;
        } catch (error) {
            console.error('❌ Error saving form data:', error);
            return false;
        }
    }

    static getFormData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.FORM_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Error loading form data:', error);
            return null;
        }
    }

    static saveSelectedCountry(country) {
        try {
            const selectedCountries = this.getSelectedCountries();
            selectedCountries.push({
                ...country,
                selectedAt: new Date().toISOString()
            });
            
            // Keep only last 5 selections
            const recentSelections = selectedCountries.slice(-5);
            
            localStorage.setItem(this.STORAGE_KEYS.SELECTED_COUNTRIES, JSON.stringify(recentSelections));
            console.log('💾 Selected country saved:', country.name);
            return true;
        } catch (error) {
            console.error('❌ Error saving selected country:', error);
            return false;
        }
    }

    static getSelectedCountries() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SELECTED_COUNTRIES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Error loading selected countries:', error);
            return [];
        }
    }

    static showStorageIndicator(message) {
        // Create or update storage indicator
        let indicator = document.getElementById('storage-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'storage-indicator';
            indicator.className = 'local-storage-indicator';
            document.body.appendChild(indicator);
        }
        
        indicator.innerHTML = `💾 ${message}`;
        indicator.classList.add('show');
        
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }

    static clearAllData() {
        try {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            console.log('🗑️ All visa data cleared from localStorage');
            return true;
        } catch (error) {
            console.error('❌ Error clearing data:', error);
            return false;
        }
    }
}
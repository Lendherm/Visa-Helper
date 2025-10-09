import { CREDENTIALS } from "./credentials.js";


// ===== SERVICIO DE APIS =====

class APIService {
    static baseURLs = {
        countries: 'https://restcountries.com/v3.1',
        translation: 'https://translation.googleapis.com/language/translate/v2',
    };

    static apiKeys = {
        translation: 'TU_API_KEY_GOOGLE_TRANSLATE'
    };

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 5000);
    }
}

// ===== SERVICIO DE TRADUCCIÓN =====
class TranslationService {
    static async translateText(text, targetLanguage = 'en') {
        if (!text) return text;

        try {
            console.log(`🌐 Traduciendo: "${text}" → ${targetLanguage}`);

            // Llamada al endpoint de Netlify Functions
            const res = await fetch(`/api/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, target: targetLanguage })
            });

            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();

            return data.translatedText || text;

        } catch (err) {
            console.error('❌ Error al traducir:', err);
            return text; // fallback al texto original
        }
    }

    static async translateForm() {
        const purpose = document.getElementById('purpose');
        const additionalInfo = document.getElementById('additionalInfo');

        if (purpose?.value) purpose.value = await this.translateText(purpose.value, 'en');
        if (additionalInfo?.value) additionalInfo.value = await this.translateText(additionalInfo.value, 'en');

        APIService.showNotification('Formulario traducido al inglés', 'success');
    }

    static demoTranslate() {
        const sampleText = "Bienvenido a Visa Helper";
        this.translateText(sampleText, 'en').then(translated => {
            APIService.showNotification(`Ejemplo: "${sampleText}" → "${translated}"`, 'info');
        });
    }
}

// ===== SERVICIO DE PAÍSES =====
class CountryService {
    static async loadCountries() {
        try {
            const status = document.getElementById('countries-status');
            status.textContent = 'Cargando...';
            status.className = 'api-status loading';

            const response = await fetch(`${APIService.baseURLs.countries}/all?fields=name,flags`);
            const countries = await response.json();

            if (countries.length > 0) {
                this.populateCountrySelect(countries);
                APIService.showNotification(`Loaded ${countries.length} countries`, 'success');
                status.textContent = `${countries.length} países`;
                status.className = 'api-status connected';
            } else {
                throw new Error('No se recibieron países');
            }
        } catch (error) {
            console.error('Error loading countries:', error);
            APIService.showNotification('Error cargando países', 'error');

            const status = document.getElementById('countries-status');
            status.textContent = 'Error';
            status.className = 'api-status error';
            this.loadLocalCountries();
        }
    }

    static populateCountrySelect(countries) {
        const select = document.getElementById('country');
        select.innerHTML = '<option value="">Selecciona un país</option>';

        countries
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .forEach(country => {
                const option = document.createElement('option');
                option.value = country.cca2;
                option.textContent = country.name.common;
                select.appendChild(option);
            });
    }

    static loadLocalCountries() {
        const fallbackCountries = [
            { cca2: 'MX', name: { common: 'México' } },
            { cca2: 'US', name: { common: 'United States' } },
            { cca2: 'CA', name: { common: 'Canada' } },
            { cca2: 'ES', name: { common: 'Spain' } },
            { cca2: 'FR', name: { common: 'France' } },
            { cca2: 'DE', name: { common: 'Germany' } },
            { cca2: 'IT', name: { common: 'Italy' } },
            { cca2: 'JP', name: { common: 'Japan' } },
            { cca2: 'KR', name: { common: 'South Korea' } },
            { cca2: 'CN', name: { common: 'China' } },
            { cca2: 'BR', name: { common: 'Brazil' } },
            { cca2: 'AR', name: { common: 'Argentina' } },
            { cca2: 'CO', name: { common: 'Colombia' } },
            { cca2: 'PE', name: { common: 'Peru' } },
            { cca2: 'CL', name: { common: 'Chile' } }
        ];
        this.populateCountrySelect(fallbackCountries);
    }
}

// ===== SERVICIO DE CALENDARIO =====
class CalendarService {
    static CLIENT_ID = CREDENTIALS.GOOGLE_CLIENT_ID;
    static DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
    static SCOPES = 'https://www.googleapis.com/auth/calendar.events';

    static async init() {
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', async () => {
                try {
                    await gapi.client.init({
                        clientId: this.CLIENT_ID,
                        discoveryDocs: this.DISCOVERY_DOCS,
                        scope: this.SCOPES,
                    });
                    console.log('✅ Google API inicializada correctamente');
                    resolve(true);
                } catch (error) {
                    console.error('❌ Error al inicializar Google API:', error);
                    APIService.showNotification('Error al inicializar Google Calendar', 'error');
                    reject(error);
                }
            });
        });
    }

    static async signIn() {
        const GoogleAuth = gapi.auth2.getAuthInstance();
        if (!GoogleAuth.isSignedIn.get()) {
            await GoogleAuth.signIn();
            APIService.showNotification('✅ Sesión iniciada con Google', 'success');
        }
    }

    static async addEvent(eventDetails) {
        try {
            await this.init();
            await this.signIn();

            const event = {
                summary: eventDetails.summary || 'Recordatorio Visa Helper',
                description: eventDetails.description || 'Seguimiento de trámite de visa',
                start: { dateTime: eventDetails.start },
                end: { dateTime: eventDetails.end },
                location: eventDetails.location || 'Online'
            };

            const response = await gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });

            APIService.showNotification('📅 Evento agregado a Google Calendar', 'success');
            document.getElementById('calendar-status').textContent = 'Conectado a Google';
            document.getElementById('calendar-status').className = 'api-status connected';
            console.log('✅ Evento creado:', response.result);
            return response.result;
        } catch (error) {
            console.error('❌ Error agregando evento:', error);
            APIService.showNotification('Error agregando evento al Google Calendar', 'error');
            document.getElementById('calendar-status').textContent = 'Error';
            document.getElementById('calendar-status').className = 'api-status error';
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    CountryService.loadCountries();
    document.getElementById('translation-status').className = 'api-status connected';
    document.getElementById('calendar-status').className = 'api-status connected';
});

export { CalendarService, TranslationService };

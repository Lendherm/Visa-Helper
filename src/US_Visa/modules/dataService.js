// modules/dataService.js
export class DataService {
    static async fetchCountries() {
        try {
            console.log('🌍 Fetching countries from REST Countries API...');
            
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,cca2');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const countries = await response.json();
            console.log(`✅ ${countries.length} countries loaded successfully`);
            
            return countries.slice(0, 15).map(country => ({
                name: country.name.common,
                capital: country.capital?.[0] || 'N/A',
                population: country.population?.toLocaleString() || 'N/A',
                region: country.region,
                flag: country.flags.png,
                code: country.cca2,
                currency: 'Various',
                language: 'Multiple',
                timezone: 'Various'
            }));
            
        } catch (error) {
            console.error('❌ Error fetching countries:', error);
            throw new Error('No se pudieron cargar los países. Por favor, intenta más tarde.');
        }
    }

    static async fetchLocalCountries() {
        const localCountries = [
            {
                name: "Estados Unidos",
                capital: "Washington D.C.",
                population: "331,000,000",
                region: "Américas",
                flag: "https://flagcdn.com/w320/us.png",
                code: "US",
                currency: "USD",
                language: "Inglés",
                timezone: "UTC-5 to UTC-10"
            },
            // ... (include all your local countries data)
        ];

        console.log(`✅ ${localCountries.length} local countries loaded`);
        return localCountries;
    }
}
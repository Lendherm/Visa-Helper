// src/scripts/page-translator.js

import { TranslationService } from './api-service.js';


console.log("✅ [page-translator.js] Iniciando script...");

class PageTranslator {
    constructor() {
        this.currentLanguage = 'es';
        this.languages = {
            'es': { name: 'Español', flag: '🇪🇸' },
            'en': { name: 'English', flag: '🇺🇸' },
            'pt': { name: 'Português', flag: '🇧🇷' }
        };
        this.isTranslating = false;
        this.originalContent = new Map();
        
        this.init();
    }

    init() {
        console.log("📦 DOM completamente cargado.");

        // Guardar contenido original
        this.saveOriginalContent();
        
        // Crear el menú desplegable
        this.createLanguageDropdown();
    }

    saveOriginalContent() {
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th, div:not(.exclude-translation)');
        textElements.forEach(element => {
            if (element.children.length === 0 && element.textContent.trim()) {
                this.originalContent.set(element, {
                    text: element.textContent,
                    placeholder: element.placeholder || '',
                    title: element.title || ''
                });
            }
        });
        console.log(`🔍 Guardados ${this.originalContent.size} elementos para traducción.`);
    }

    createLanguageDropdown() {
        const translateBtn = document.getElementById('translate-page-btn'); // <-- ID corregido
        if (!translateBtn) {
            console.error("❌ No se encontró el botón con id='translate-page-btn'.");
            return;
        }

        console.log("🔍 Botón encontrado:", translateBtn);

        // Crear contenedor del dropdown
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'language-dropdown';
        dropdownContainer.innerHTML = `
            <button class="translate-btn dropdown-toggle">
                <i class="bi bi-translate"></i> ${this.languages[this.currentLanguage].flag} ${this.languages[this.currentLanguage].name}
                <i class="bi bi-chevron-down"></i>
            </button>
            <div class="dropdown-menu">
                <div class="dropdown-item" data-lang="es">
                    <span class="flag">🇪🇸</span>
                    <span class="language-name">Español</span>
                </div>
                <div class="dropdown-item" data-lang="en">
                    <span class="flag">🇺🇸</span>
                    <span class="language-name">English</span>
                </div>
                <div class="dropdown-item" data-lang="pt">
                    <span class="flag">🇧🇷</span>
                    <span class="language-name">Português</span>
                </div>
            </div>
        `;

        // Reemplazar el botón original
        translateBtn.replaceWith(dropdownContainer);
        console.log("🔧 Dropdown creado y reemplazado el botón.");

        // Configurar eventos
        this.setupDropdownEvents(dropdownContainer);
    }

    setupDropdownEvents(container) {
        const toggle = container.querySelector('.dropdown-toggle');
        const menu = container.querySelector('.dropdown-menu');
        const items = container.querySelectorAll('.dropdown-item');

        console.log("🔍 Configurando eventos del dropdown...");

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
            console.log("🔽 Toggle del menú:", menu.classList.contains('show') ? "abierto" : "cerrado");
        });

        items.forEach(item => {
            item.addEventListener('click', async (e) => {
                e.stopPropagation();
                const targetLang = item.getAttribute('data-lang');
                console.log(`🌐 Idioma seleccionado: ${targetLang}`);

                if (targetLang !== this.currentLanguage && !this.isTranslating) {
                    await this.translatePage(targetLang);
                    this.currentLanguage = targetLang;
                    
                    toggle.innerHTML = `
                        <i class="bi bi-translate"></i> 
                        ${this.languages[targetLang].flag} 
                        ${this.languages[targetLang].name}
                        <i class="bi bi-chevron-down"></i>
                    `;
                }
                menu.classList.remove('show');
            });
        });

        document.addEventListener('click', () => {
            menu.classList.remove('show');
        });
    }

    async translatePage(targetLang) {
        if (this.isTranslating) {
            console.log('⚠️ Ya se está traduciendo la página...');
            return;
        }

        try {
            this.isTranslating = true;
            console.log(`🔄 Traduciendo página a ${this.languages[targetLang].name}...`);

            const elementsToTranslate = Array.from(this.originalContent.keys());
            const batchSize = 5;

            for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
                const batch = elementsToTranslate.slice(i, i + batchSize);
                await this.translateBatch(batch, targetLang);

                const progress = Math.min(((i + batchSize) / elementsToTranslate.length) * 100, 100);
                console.log(`📈 Progreso de traducción: ${Math.round(progress)}%`);
            }

            console.log(`✅ Página traducida al ${this.languages[targetLang].name}`);
        } catch (error) {
            console.error('❌ Error en traducción:', error);
        } finally {
            this.isTranslating = false;
        }
    }

    async translateBatch(elements, targetLang) {
        const promises = elements.map(async (element) => {
            const originalData = this.originalContent.get(element);

            if (originalData && originalData.text.trim()) {
                try {
                    const translatedText = await TranslationService.translateText(originalData.text, targetLang);
                    element.textContent = translatedText;

                    if (originalData.placeholder) {
                        const translatedPlaceholder = await TranslationService.translateText(originalData.placeholder, targetLang);
                        element.placeholder = translatedPlaceholder;
                    }

                    if (originalData.title) {
                        const translatedTitle = await TranslationService.translateText(originalData.title, targetLang);
                        element.title = translatedTitle;
                    }
                } catch (error) {
                    console.warn(`⚠️ No se pudo traducir: "${originalData.text}"`, error);
                }
            }
        });

        await Promise.all(promises);
    }

    restoreOriginalContent() {
        this.originalContent.forEach((originalData, element) => {
            element.textContent = originalData.text;
            if (originalData.placeholder) element.placeholder = originalData.placeholder;
            if (originalData.title) element.title = originalData.title;
        });
        this.currentLanguage = 'es';
        console.log("♻️ Contenido original restaurado.");
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.pageTranslator = new PageTranslator();
});

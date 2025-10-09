// netlify/functions/translate.js
const { Translate } = require('@google-cloud/translate').v2;

exports.handler = async (event, context) => {
    // Solo permitimos POST
    if (event.httpMethod !== 'POST' || !event.body) {
        return { statusCode: 405, body: "Método no permitido." };
    }

    try {
        const { text, target } = JSON.parse(event.body);
        const translate = new Translate(); // Usa GOOGLE_APPLICATION_CREDENTIALS

        let [translations] = await translate.translate(text, target);
        const translatedText = Array.isArray(translations) ? translations[0] : translations;

        return {
            statusCode: 200,
            body: JSON.stringify({ translatedText }),
            headers: {
                "Content-Type": "application/json"
            }
        };

    } catch (error) {
        console.error('Error de traducción:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno en el servicio de traducción.' }),
            headers: { "Content-Type": "application/json" }
        };
    }
};

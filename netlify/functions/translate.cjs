const { Translate } = require('@google-cloud/translate').v2;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' || !event.body) {
    return { statusCode: 405, body: "Método no permitido." };
  }

  try {
    const { text, target } = JSON.parse(event.body);

    const credentials = {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    };

    const translate = new Translate({ credentials, projectId: credentials.project_id });

    const [translations] = await translate.translate(text, target);
    const translatedText = Array.isArray(translations) ? translations[0] : translations;

    return {
      statusCode: 200,
      body: JSON.stringify({ translatedText }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error('Error de traducción:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

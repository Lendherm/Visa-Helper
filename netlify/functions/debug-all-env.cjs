// netlify/functions/debug-all-env.cjs
exports.handler = async () => {
  try {
    // Mostrar solo claves y primeros 50 caracteres de cada valor
    const envSummary = {};
    for (const [key, value] of Object.entries(process.env)) {
      envSummary[key] = value ? value.toString().slice(0, 50) + (value.length > 50 ? "..." : "") : "❌ no definido";
    }

    return {
      statusCode: 200,
      body: JSON.stringify(envSummary, null, 2),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};

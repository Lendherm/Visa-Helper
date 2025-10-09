// netlify/functions/debug-env.cjs
exports.handler = async () => {
  try {
    const keysToCheck = [
      "GOOGLE_PROJECT_ID",
      "GOOGLE_CLIENT_EMAIL",
      "GOOGLE_PRIVATE_KEY",
    ];

    const status = {};
    keysToCheck.forEach((key) => {
      status[key] = process.env[key] ? "✅ definido" : "❌ no definido";
    });

    return {
      statusCode: 200,
      body: JSON.stringify(status, null, 2),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};

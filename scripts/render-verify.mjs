const target = process.argv[2];

if (!target) {
  console.error(
    "Usage: node scripts/render-verify.mjs https://your-app.onrender.com",
  );
  process.exit(1);
}

const baseUrl = target.replace(/\/+$/, "");
const healthUrl = `${baseUrl}/api/health`;

const check = async (url, label) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${label} failed with status ${response.status}`);
  }

  console.log(`[render-verify] ${label} OK -> ${url}`);
  return response;
};

try {
  await check(baseUrl, "Frontend");
  const healthResponse = await check(healthUrl, "Health endpoint");
  const healthJson = await healthResponse.json();
  console.log("[render-verify] Health payload:", healthJson);
} catch (error) {
  console.error("[render-verify] Verification failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

/**
 * Serverless function: lists form submissions from Netlify Forms.
 * Required env vars (Site settings → Environment variables):
 *  - NETLIFY_ACCESS_TOKEN : Personal access token
 *  - NETLIFY_SITE_ID      : Site API ID (from Site settings → General → Site details)
 *  - FORM_NAME            : (optional) defaults to 'orders'
 */
export async function handler(event, context) {
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;
  const formName = process.env.FORM_NAME || 'orders';

  if (!token || !siteId) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing NETLIFY_ACCESS_TOKEN or NETLIFY_SITE_ID." })
    };
  }

  const base = "https://api.netlify.com/api/v1";
  const headers = { "Authorization": `Bearer ${token}` };

  // Find the form by name for this site
  const formsRes = await fetch(`${base}/sites/${siteId}/forms`, { headers });
  if (!formsRes.ok) {
    const txt = await formsRes.text();
    return { statusCode: 502, headers: { "content-type": "application/json" }, body: JSON.stringify({ error: "Failed to fetch forms", details: txt }) };
  }
  const forms = await formsRes.json();
  const form = forms.find(f => (f.name || '').toLowerCase() === formName.toLowerCase());
  if (!form) {
    return { statusCode: 404, headers: { "content-type": "application/json" }, body: JSON.stringify({ error: `Form '${formName}' not found` }) };
  }

  // Get submissions
  const subsRes = await fetch(`${base}/forms/${form.id}/submissions?per_page=100`, { headers });
  if (!subsRes.ok) {
    const txt = await subsRes.text();
    return { statusCode: 502, headers: { "content-type": "application/json" }, body: JSON.stringify({ error: "Failed to fetch submissions", details: txt }) };
  }
  const subs = await subsRes.json();

  // Map a safe, lean payload for the dashboard
  const rows = subs.map(s => ({
    id: s.id,
    created_at: s.created_at,
    data: s.data || {}
  }));

  return {
    statusCode: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify(rows)
  };
}
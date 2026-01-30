export default async function handler(req, res) {
  const token = process.env.METAAPI_TOKEN;
  const accountId = "d769e348-5db8-4df0-97f9-5b45bdb8b8c3";
  
  // List of all possible offices
  const regions = ['new-york', 'london', 'singapore'];

  for (let region of regions) {
    const url = `https://metastats-api-v1.${region}.agiliumtrade.ai/users/current/accounts/${accountId}/summary`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'auth-token': token }
      });

      if (response.status === 200) {
        const data = await response.json();
        return res.status(200).json({ regionFound: region, ...data });
      }
    } catch (err) {
      // If one office fails, it just tries the next one
    }
  }

  return res.status(404).json({ error: "Still not found in any region. Check MetaStats is enabled on dashboard." });
}

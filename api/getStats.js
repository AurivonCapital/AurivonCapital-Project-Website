export default async function handler(req, res) {
    const TOKEN = process.env.METAAPI_TOKEN;
    const ID = "d769e348-5db8-4df0-97f9-5b45bdb8b8c3";
    
    try {
        // We are now targeting the Singapore server for Eightcap/Australia
        const url = `https://metastats-api-v1.singapore.agiliumtrade.ai/users/current/accounts/${ID}/summary`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'auth-token': TOKEN,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "MetaApi Error",
                status: response.status,
                details: data.message || data
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Bridge Connection Failed", message: error.message });
    }
}

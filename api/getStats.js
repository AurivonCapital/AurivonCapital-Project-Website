export default async function handler(req, res) {
    const TOKEN = process.env.METAAPI_TOKEN;
    const ID = "d769e348-5db8-4df0-97f9-5b45bdb8b8c3"; 

    try {
        // We are using the 'metastats-api' address which is the standard for your account type
        const response = await fetch(`https://metastats-api-v1.new-york.agiliumtrade.ai/users/current/accounts/${ID}/summary`, {
            headers: { 'auth-token': TOKEN }
        });

        const data = await response.json();

        // If it's still failing, this will tell us EXACTLY why (e.g. "Account Not Found")
        if (!response.ok) {
            return res.status(response.status).json({
                message: "MetaApi returned an error",
                status: response.status,
                details: data
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Connection Failed", message: error.message });
    }
}

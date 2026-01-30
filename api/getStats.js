import MetaApi from 'metaapi.cloud-sdk';

/**
 * This function connects to MetaApi, loops through your trader accounts,
 * and gathers their balance and profit data to show on your dashboard.
 */
export default async function dashboardHandler(req, res) {
  // 1. Setup your credentials
  const token = process.env.METAAPI_TOKEN;
  
  // This is the main "engine" that talks to MetaApi
  const api = new MetaApi(token);

  // 2. List your 20 Account IDs here
  // Replace the "ACCOUNT_ID_X" placeholders with your actual IDs from MetaApi
  const traderAccounts = [
    "d769e348-5db8-4df0-97f9-5b45bdb8b8c3", 
    "ACCOUNT_ID_2",
    "ACCOUNT_ID_3",
    "ACCOUNT_ID_4",
    "ACCOUNT_ID_5",
    "ACCOUNT_ID_6",
    "ACCOUNT_ID_7",
    "ACCOUNT_ID_8",
    "ACCOUNT_ID_9",
    "ACCOUNT_ID_10",
    "ACCOUNT_ID_11",
    "ACCOUNT_ID_12",
    "ACCOUNT_ID_13",
    "ACCOUNT_ID_14",
    "ACCOUNT_ID_15",
    "ACCOUNT_ID_16",
    "ACCOUNT_ID_17",
    "ACCOUNT_ID_18",
    "ACCOUNT_ID_19",
    "ACCOUNT_ID_20"
  ];

  try {
    // If there is no token, we can't proceed
    if (!token) {
      return res.status(500).json({ error: "Missing METAAPI_TOKEN in environment variables." });
    }

    const metaStats = api.metaStatsApi;

    // 3. Fetch data for all accounts at the same time
    const dashboardData = await Promise.all(
      traderAccounts.map(async (id) => {
        // If the ID is still a placeholder, skip it
        if (id.includes("ACCOUNT_ID")) return { accountId: id, status: "Empty Slot" };

        try {
          // Get the statistics (Balance, Equity, Profit)
          const metrics = await metaStats.getMetrics(id);
          
          return {
            accountId: id,
            status: "Online",
            balance: metrics.balance || 0,
            equity: metrics.equity || 0,
            profit: metrics.profit || 0
          };
        } catch (err) {
          // If one specific account fails, show it as offline
          return { 
            accountId: id, 
            status: "Offline", 
            error: "Check if MetaStats is enabled" 
          };
        }
      })
    );

    // 4. Send the final list of 20 results back to your website
    return res.status(200).json(dashboardData);

  } catch (error) {
    // If the whole system crashes, show this error
    return res.status(500).json({ error: "System Error: " + error.message });
  }
}

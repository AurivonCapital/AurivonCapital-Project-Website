import MetaApi from 'metaapi.cloud-sdk';

const token = process.env.METAAPI_TOKEN;
const api = new MetaApi(token);

// List your 20 Account IDs here
const traderAccounts = [
  "d769e348-5db8-4df0-97f9-5b45bdb8b8c3",
  "ACCOUNT_ID_2",
  "ACCOUNT_ID_3",
  // ... add all 20
];

export default async function dashboardHandler(req, res) {
  try {
    const metaStats = api.metaStatsApi;

    // Fetch metrics for all 20 accounts in parallel
    const dashboardData = await Promise.all(
      traderAccounts.map(async (id) => {
        try {
          // Get basic metrics (Balance, Equity, Margin, etc.)
          const metrics = await metaStats.getMetrics(id);
          
          return {
            accountId: id,
            status: "Online",
            balance: metrics.balance,
            equity: metrics.equity,
            profit: metrics.profit,
            drawdown: metrics.maxDrawdown || 0
          };
        } catch (err) {
          return { accountId: id, status: "Offline", error: err.message };
        }
      })
    );

    res.status(200).json({
      totalTraders: traderAccounts.length,
      lastUpdated: new Date().toISOString(),
      accounts: dashboardData
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to load dashboard data." });
  }
}

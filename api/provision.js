const Stripe = require('stripe');
const MetaApi = require('metaapi.cloud-sdk').default;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const metaApi = new MetaApi(process.env.METAAPI_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const traderEmail = session.customer_details.email;

    try {
      // Create the account using your Eightcap Profile
      const account = await metaApi.metatraderAccountApi.createAccount({
        name: `Aurivon Trader: ${traderEmail}`,
        type: 'cloud',
        plan: 'v1',
        provisioningProfileId: '51365c22-c0d0-4e35-9f25-1a386bf140bb',
        login: process.env.MT4_LOGIN,      // Pulls from Vercel Vault
        password: process.env.MT4_PASSWORD, // Pulls from Vercel Vault
        server: 'Eightcap-Demo',            // Official Eightcap Server Name
        platform: 'mt4',
        magic: 123456
      });

      console.log('Success! Account created with ID:', account.id);
    } catch (error) {
      console.error('MetaApi Error:', error.message);
    }
  }

  res.json({ received: true });
}

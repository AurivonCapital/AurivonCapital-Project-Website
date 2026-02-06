import MetaApi from 'metaapi.cloud-sdk';
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const metaApi = new MetaApi(process.env.METAAPI_TOKEN);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the payment is real and from Stripe
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // When the payment is successful...
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const customerEmail = session.customer_details.email;

        try {
            console.log(`Creating MetaApi account for: ${customerEmail}`);

            // This tells MetaApi to create the actual Eightcap account
            await metaApi.metatraderAccountApi.createAccount({
                name: `Aurivon - ${customerEmail}`,
                type: 'cloud',
                platform: 'mt4', // or 'mt5' depending on your preference
                region: 'vint-hill', // Standard region for Eightcap
                manualConfiguration: {
                    server: 'Eightcap-Demo',
                    login: 0, // MetaApi will generate these or you can link existing
                    password: 'TraderPassword123' 
                }
            });

            console.log("Account Created Successfully");
        } catch (error) {
            console.error("MetaApi Error:", error.message);
        }
    }

    res.json({ received: true });
}

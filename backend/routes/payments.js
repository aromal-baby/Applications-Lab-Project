const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Creating payment intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'eur', items } = req.body;

        console.log('Creating payment intent:', { amount, currency, itemCount: items?.length });

        // Validating amount
        if (!amount || isNaN(amount) || amount < 0.5) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert euros to cents
            currency: currency,
            metadata: {
                itemCount: items ? items.length.toString() : '0',
                items: JSON.stringify(items?.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })) || [])
            }
        });

        console.log('Payment intent created:', paymentIntent.id);

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({
            error: error.message || 'Failed to create payment intent'
        });
    }
});

// To get the payment status
router.get('/payment-intent/:id', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert back to euros
            currency: paymentIntent.currency
        });
    } catch (error) {
        console.error('Payment intent retrieval error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // In production, verify webhook signature
        // event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        // For development
        event = JSON.parse(req.body.toString());

    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handling the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            // Here you would update your database, send confirmation emails, etc.
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

module.exports = router;
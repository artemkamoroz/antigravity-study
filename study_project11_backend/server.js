require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase Init
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co')
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Stripe Init
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const nodemailer = require('nodemailer');

// Email Init
const transporter = nodemailer.createTransport({
    service: 'gmail', // Simplest for study projects
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App Password
    }
});

// Middleware to handle Stripe Webhooks (req.body must be raw)
app.use(cors());

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
        );
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Payment Successful for session:', session.id);

        const userId = session.metadata.userId;
        const amount = session.amount_total / 100;

        // 1. Save to Supabase
        if (supabase) {
            const { error } = await supabase.from('orders').insert([{
                stripe_session_id: session.id,
                user_id: userId,
                amount: amount,
                status: 'paid',
                created_at: new Date().toISOString()
            }]);
            if (error) console.error('DB Order Error:', error);
        }

        // 2. Send Email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: session.customer_details?.email || 'user@example.com', // Stripe collects email
                subject: 'Ваш заказ в iStore успешно оплачен! 🎉',
                text: `Спасибо за покупку! Сумма заказа: ${amount} ₽. Мы скоро свяжемся с вами.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Email Error:', error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } else {
            console.log('⚠️ Email credentials not found. Skipping email sending.');
        }
    }

    res.json({ received: true });
});

app.use(express.json());

// Routes
app.get('/api/products', async (req, res) => {
    if (supabase) {
        console.log('Fetching products from Supabase...');
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error('Supabase Error:', error);
            return res.json(staticProducts);
        }
        return res.json(data);
    }

    console.log('Supabase not configured. Using static fallback.');
    res.json(staticProducts);
});

// User Orders Route
app.get('/api/orders/:userId', async (req, res) => {
    const { userId } = req.params;
    if (supabase) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
    }
    // Static fallback for dev
    res.json([
        { id: 'fake_1', amount: 99900, status: 'paid', created_at: new Date().toISOString() }
    ]);
});

// Stripe Checkout Route

// Stripe Checkout Route
app.post('/api/create-checkout-session', async (req, res) => {
    const { items, userId } = req.body;

    try {
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'rub',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: item.price * 100, // В копейках
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:5178/cart?success=true`,
            cancel_url: `http://localhost:5178/cart?canceled=true`,
            metadata: { userId },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Implementation of Order Saving
app.post('/api/orders', async (req, res) => {
    const order = req.body;
    console.log('New Order Received:', order);

    if (supabase) {
        const { data, error } = await supabase.from('orders').insert([order]);
        if (error) {
            console.error('Order Save Error:', error);
            return res.status(500).json({ success: false, message: 'DB Error' });
        }
        return res.json({ success: true, data });
    }

    // Simulate success for local dev
    res.json({ success: true, message: 'Order simulated (Local Mode)' });
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
    if (!supabase) {
        console.log('⚠️ Running in LOCAL MODE. Database integration is ready but waiting for credentials in .env');
    } else {
        console.log('🚀 Cloud Mode ACTIVE. Connected to Supabase.');
    }
});

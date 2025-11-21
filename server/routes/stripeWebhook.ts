import { Router, raw } from 'express';
import Stripe from 'stripe';
import { BillingService } from '../services/billingService';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const billingService = new BillingService();

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// POST /api/stripe/webhook
router.post('/webhook', raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return res.status(500).json({ message: 'Webhook secret not configured' });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    // Handle the event
    await billingService.handleWebhookEvent(event);

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

export default router;
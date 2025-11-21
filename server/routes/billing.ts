import { Router } from 'express';
import { BillingService } from '../services/billingService';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import { Plan } from '../../shared/types/billing';

const router = Router();
const billingService = new BillingService();

// GET /api/billing/prices
router.get('/prices', async (req, res) => {
  try {
    const prices = await billingService.getPrices();
    res.json(prices);
  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({ message: 'Failed to get pricing information' });
  }
});

// POST /api/billing/checkout
router.post('/checkout', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { plan, billingCycle } = req.body;
    
    if (!plan || !billingCycle) {
      return res.status(400).json({ message: 'Plan and billing cycle are required' });
    }

    if (!['pro', 'business'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return res.status(400).json({ message: 'Invalid billing cycle' });
    }

    const checkoutSession = await billingService.createCheckoutSession(
      plan as Plan,
      billingCycle,
      req.user.email,
      req.user.id
    );

    res.json(checkoutSession);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

// GET /api/billing/portal
router.get('/portal', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const customerId = req.user.subscription?.customerId;
    if (!customerId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    const portalSession = await billingService.createCustomerPortalSession(customerId);
    
    res.json(portalSession);
  } catch (error) {
    console.error('Customer portal error:', error);
    res.status(500).json({ message: 'Failed to create customer portal session' });
  }
});

export default router;
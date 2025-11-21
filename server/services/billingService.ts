import Stripe from 'stripe';
import { Plan, PlanConfig, CheckoutSession, BillingCycle } from '../../shared/types/billing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

const APP_URL = process.env.APP_URL || 'http://localhost:5000';

// Plan configurations
export const PLAN_CONFIGS: Record<Plan, PlanConfig> = {
  free: {
    name: 'Free',
    features: {
      maxProjects: 3,
      maxTeamMembers: 1,
      advancedAnalytics: false,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false,
    },
    monthlyPrice: 0,
    yearlyPrice: 0,
  },
  pro: {
    name: 'Pro',
    features: {
      maxProjects: 25,
      maxTeamMembers: 5,
      advancedAnalytics: true,
      prioritySupport: true,
      customBranding: false,
      apiAccess: true,
    },
    monthlyPrice: 29,
    yearlyPrice: 290, // 2 months free
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTH,
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEAR,
    popular: true,
  },
  business: {
    name: 'Business',
    features: {
      maxProjects: 100,
      maxTeamMembers: 25,
      advancedAnalytics: true,
      prioritySupport: true,
      customBranding: true,
      apiAccess: true,
    },
    monthlyPrice: 99,
    yearlyPrice: 990, // 2 months free
    stripePriceIdMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTH,
    stripePriceIdYearly: process.env.STRIPE_PRICE_BUSINESS_YEAR,
  },
};

export class BillingService {
  async getPrices(): Promise<Record<Plan, PlanConfig>> {
    return PLAN_CONFIGS;
  }

  async createCheckoutSession(
    plan: Plan,
    billingCycle: 'monthly' | 'yearly',
    userEmail: string,
    userId: string
  ): Promise<CheckoutSession> {
    if (plan === 'free') {
      throw new Error('Cannot create checkout session for free plan');
    }

    const planConfig = PLAN_CONFIGS[plan];
    const priceId = billingCycle === 'monthly' 
      ? planConfig.stripePriceIdMonthly 
      : planConfig.stripePriceIdYearly;

    if (!priceId) {
      throw new Error(`Price ID not configured for ${plan} ${billingCycle}`);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        plan,
        billingCycle,
      },
      success_url: `${APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    });

    if (!session.id || !session.url) {
      throw new Error('Failed to create checkout session');
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async createCustomerPortalSession(customerId: string): Promise<{ url: string }> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${APP_URL}/settings/billing`,
    });

    return { url: session.url };
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    console.log(`Processing Stripe webhook: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const { userId, plan, billingCycle } = session.metadata || {};
    
    if (!userId || !plan) {
      console.error('Missing metadata in checkout session', session.metadata);
      return;
    }

    console.log(`Checkout completed for user ${userId}, plan: ${plan}, cycle: ${billingCycle}`);
    
    // In a real app, you would update the user's subscription in the database
    // For now, we'll just log it
    // await updateUserSubscription(userId, {
    //   plan: plan as Plan,
    //   status: 'active',
    //   customerId: session.customer as string,
    //   currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    // });
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
    
    // Update user subscription status based on Stripe subscription
    // This would typically involve database updates
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    console.log(`Subscription deleted: ${subscription.id}`);
    
    // Downgrade user to free plan
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    console.log(`Payment failed for invoice: ${invoice.id}`);
    
    // Send notification to user about payment failure
    // Update subscription status to past_due
  }

  calculateTrialDaysRemaining(trialEndsAt: string): number {
    const trialEnd = new Date(trialEndsAt);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}
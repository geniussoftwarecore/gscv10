export type Plan = 'free' | 'pro' | 'business';

export interface Subscription {
  plan: Plan;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  trialEndsAt?: string;
  currentPeriodEnd?: string;
  customerId?: string;
  priceId?: string;
}

export interface PlanFeatures {
  maxProjects: number;
  maxTeamMembers: number;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
  apiAccess: boolean;
}

export interface PlanConfig {
  name: string;
  features: PlanFeatures;
  monthlyPrice: number;
  yearlyPrice: number;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  popular?: boolean;
}

export interface BillingCycle {
  period: 'monthly' | 'yearly';
  discount?: number;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './requireAuth';
import { Plan } from '../../shared/types/billing';

const PLAN_HIERARCHY: Record<Plan, number> = {
  free: 0,
  pro: 1,
  business: 2,
};

export function requirePlan(requiredPlan: Plan) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userPlan = req.user.subscription?.plan || 'free';
    const userPlanLevel = PLAN_HIERARCHY[userPlan];
    const requiredPlanLevel = PLAN_HIERARCHY[requiredPlan];

    // Check if user's plan is sufficient
    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({ 
        message: `This feature requires ${requiredPlan} plan or higher`,
        currentPlan: userPlan,
        requiredPlan: requiredPlan
      });
    }

    // Check if subscription is active (not expired trial)
    if (req.user.subscription?.status === 'trialing') {
      const trialEndsAt = req.user.subscription.trialEndsAt;
      if (trialEndsAt && new Date(trialEndsAt) < new Date()) {
        return res.status(403).json({ 
          message: 'Your trial has expired. Please upgrade to continue using this feature.',
          trialExpired: true
        });
      }
    }

    if (req.user.subscription?.status && !['active', 'trialing'].includes(req.user.subscription.status)) {
      return res.status(403).json({ 
        message: 'Your subscription is not active. Please update your payment method.',
        subscriptionStatus: req.user.subscription.status
      });
    }

    next();
  };
}
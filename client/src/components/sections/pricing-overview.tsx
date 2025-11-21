import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCard, AnimatedText } from "@/components/ui/animated-card";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { motion } from "framer-motion";
import { Check, Crown, Zap, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/i18n/lang";
import { Link } from "wouter";

interface PricingPlan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  period: string;
  periodEn: string;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  popular?: boolean;
  icon: typeof Star;
  color: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'باقة البداية',
    nameEn: 'Starter Plan',
    price: 2500,
    period: 'شهرياً',
    periodEn: 'monthly',
    description: 'مثالية للمشاريع الصغيرة والشركات الناشئة',
    descriptionEn: 'Perfect for small projects and startups',
    features: [
      'موقع ويب تفاعلي',
      'تصميم مخصص',
      'استضافة مجانية لعام',
      'دعم فني لمدة 6 أشهر',
      'شهادة SSL مجانية'
    ],
    featuresEn: [
      'Interactive website',
      'Custom design',
      'Free hosting for 1 year',
      'Technical support for 6 months',
      'Free SSL certificate'
    ],
    icon: Star,
    color: 'text-green-600'
  },
  {
    id: 'professional',
    name: 'باقة المحترفين',
    nameEn: 'Professional Plan',
    price: 5000,
    period: 'شهرياً',
    periodEn: 'monthly',
    description: 'الأنسب للأعمال المتوسطة والمتنامية',
    descriptionEn: 'Best for medium and growing businesses',
    features: [
      'تطبيق ويب متقدم',
      'لوحة تحكم إدارية',
      'تكامل مع وسائل الدفع',
      'تحليلات متقدمة',
      'دعم فني على مدار الساعة',
      'نسخ احتياطية يومية'
    ],
    featuresEn: [
      'Advanced web application',
      'Administrative dashboard',
      'Payment gateway integration',
      'Advanced analytics',
      '24/7 technical support',
      'Daily backups'
    ],
    popular: true,
    icon: Zap,
    color: 'text-blue-600'
  },
  {
    id: 'enterprise',
    name: 'باقة الشركات',
    nameEn: 'Enterprise Plan',
    price: 10000,
    period: 'شهرياً',
    periodEn: 'monthly',
    description: 'حلول متكاملة للشركات الكبيرة',
    descriptionEn: 'Complete solutions for large enterprises',
    features: [
      'نظام ERP متكامل',
      'تطبيق جوال أصلي',
      'تكامل مع الأنظمة الحالية',
      'أمان متقدم ومراقبة',
      'فريق دعم مخصص',
      'تدريب وصيانة مجانية'
    ],
    featuresEn: [
      'Complete ERP system',
      'Native mobile application',
      'Integration with existing systems',
      'Advanced security and monitoring',
      'Dedicated support team',
      'Free training and maintenance'
    ],
    icon: Crown,
    color: 'text-purple-600'
  }
];

export default function PricingOverview() {
  const { t } = useTranslation();
  const { lang, dir } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedText className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold text-secondary mb-6 ${dir ? 'text-right' : 'text-left'}`}>
            {t('pricing.title')}
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${dir ? 'text-right' : 'text-left'}`}>
            {t('pricing.subtitle')}
          </p>
        </AnimatedText>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <AnimatedCard
              key={plan.id}
              delay={index * 0.1}
              className="relative"
            >
              <Card className={`h-full hover:shadow-xl transition-all duration-500 ${
                plan.popular 
                  ? 'ring-2 ring-primary scale-105 transform hover:scale-110' 
                  : 'hover:scale-105 transform'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-6 py-2 text-sm font-semibold">
                      {t('pricing.mostPopular')}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="mb-4">
                    <plan.icon className={`w-12 h-12 mx-auto ${plan.color}`} />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-secondary mb-2">
                    {lang === 'ar' ? plan.name : plan.nameEn}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600 mr-2">
                      {t('pricing.currency')}
                    </span>
                    <div className="text-sm text-gray-500">
                      {t('pricing.monthly')}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {lang === 'ar' ? plan.description : plan.descriptionEn}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {(lang === 'ar' ? plan.features : plan.featuresEn).map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <Link href="/contact" className="w-full">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'bg-secondary hover:bg-secondary/90'
                      }`}
                      size="lg"
                    >
                      {t('pricing.getStarted')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        <AnimatedText className="text-center mt-12" delay={0.4}>
          <p className="text-gray-600 mb-6">
            {t('pricing.customSolution')}
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              {t('pricing.contactUs')}
            </Button>
          </Link>
        </AnimatedText>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Play } from "lucide-react";

export function ProblemSolution() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  // Define problem and solution points directly with language support
  const problemPoints = [
    dir === 'rtl' ? "أدوات متناثرة ومنفصلة" : "Fragmented and disconnected tools",
    dir === 'rtl' ? "عدم متابعة العملاء بشكل فعال" : "Poor customer follow-up",
    dir === 'rtl' ? "فوضى في إدارة البيانات" : "Data chaos and disorganization",
    dir === 'rtl' ? "صعوبة في تتبع الأداء" : "Difficulty tracking performance"
  ];
  
  const solutionPoints = [
    dir === 'rtl' ? "نظام CRM موحد ومتكامل" : "Unified and integrated CRM system",
    dir === 'rtl' ? "تنبيهات تلقائية للمتابعة" : "Automated follow-up alerts",
    dir === 'rtl' ? "تحليلات شاملة ومركزة" : "Consolidated analytics and insights",
    dir === 'rtl' ? "لوحة تحكم واضحة وسهلة" : "Clear and easy dashboard"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Problem Section */}
          <motion.div
            className={cn(
              "space-y-8",
              dir === "rtl" && "lg:order-2"
            )}
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <AlertTriangle className="w-4 h-4" />
                {dir === 'rtl' ? 'التحديات الحالية' : 'Current Challenges'}
              </motion.div>
              
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-brand-text-primary"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {t('problem.title')}
              </motion.h2>
            </div>

            <div className="space-y-4">
              {problemPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-brand-text-primary font-medium">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solution Section */}
          <motion.div
            className={cn(
              "space-y-8",
              dir === "rtl" && "lg:order-1"
            )}
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="w-4 h-4" />
                {dir === 'rtl' ? 'حلولنا المبتكرة' : 'Our Innovative Solutions'}
              </motion.div>
              
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-brand-text-primary"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                {t('solution.title')}
              </motion.h2>
            </div>

            <div className="space-y-4">
              {solutionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-brand-sky-light rounded-xl border border-brand-sky-base"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-brand-text-primary font-medium">{point}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                data-testid="problem-solution-cta"
              >
                <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                {t('solution.cta')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowDown } from "lucide-react";
import { useLanguage } from "@/i18n/lang";

interface ProcessTimelineProps {
  title: string;
  steps: (string | { phase: string; note: string })[];
}

export function ProcessTimeline({ title, steps }: ProcessTimelineProps) {
  const { dir } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50/20 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto" />
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Timeline connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-primary to-blue-600" />
              )}
              
              <Card className="mb-8 group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      {index + 1}
                    </motion.div>
                    <div className="flex-1 pt-2">
                      {typeof step === 'string' ? (
                        <p className="text-gray-700 leading-relaxed text-lg group-hover:text-gray-900 transition-colors duration-300">
                          {step}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                            {step.phase}
                          </h4>
                          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                            {step.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
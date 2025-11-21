import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface UseCasesProps {
  title: string;
  items: string[];
}

export function UseCases({ title, items }: UseCasesProps) {
  return (
    <section className="py-20">
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
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-brand-sky-base rounded-full mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </motion.div>
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                      {item}
                    </p>
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
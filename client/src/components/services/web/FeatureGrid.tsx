import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Languages, 
  Rocket, 
  Globe, 
  Search, 
  Monitor, 
  LucideIcon 
} from "lucide-react";

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface FeatureGridProps {
  title: string;
  features: Feature[];
}

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Languages,
  Rocket,
  Globe,
  Search,
  Monitor,
};

export function FeatureGrid({ title, features }: FeatureGridProps) {
  return (
    <section className="py-20 bg-gray-50/50">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Shield;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center space-y-4">
                    <motion.div
                      className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
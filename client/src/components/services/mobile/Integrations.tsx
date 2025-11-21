import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plug, 
  Bell, 
  MapPin, 
  CreditCard, 
  Camera, 
  Globe,
  MessageCircle
} from "lucide-react";

interface IntegrationsProps {
  title: string;
  items: string[];
}

const getIconForIntegration = (index: number) => {
  const icons = [Bell, MapPin, CreditCard, Camera, MessageCircle, Globe];
  const IconComponent = icons[index] || Plug;
  return <IconComponent className="w-6 h-6 text-primary" />;
};

export function Integrations({ title, items }: IntegrationsProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white hover:bg-gradient-to-br hover:from-white hover:to-brand-sky-light/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {getIconForIntegration(index)}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                        {item}
                      </p>
                      <Badge 
                        variant="outline" 
                        className="mt-3 text-xs border-primary/30 text-primary"
                      >
                        Ready
                      </Badge>
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
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package, 
  FileText, 
  Settings, 
  BookOpen, 
  Shield, 
  BarChart3, 
  Globe 
} from "lucide-react";

interface DeliverablesProps {
  title: string;
  items: string[];
}

const getDeliverableIcon = (index: number) => {
  const icons = [Package, FileText, Settings, BookOpen, Shield, BarChart3, Globe];
  const IconComponent = icons[index] || Package;
  return <IconComponent className="w-6 h-6 text-primary" />;
};

export function Deliverables({ title, items }: DeliverablesProps) {
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
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary/30 hover:bg-gradient-to-br hover:from-white hover:to-primary/5">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="w-12 h-12 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {getDeliverableIcon(index)}
                  </motion.div>
                  <p className="text-gray-700 leading-relaxed text-sm group-hover:text-gray-900 transition-colors duration-300">
                    {item}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
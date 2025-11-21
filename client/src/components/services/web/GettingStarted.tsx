import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Palette, 
  Globe, 
  Plug, 
  FileText 
} from "lucide-react";

interface GettingStartedProps {
  title: string;
  items: string[];
}

const getRequirementIcon = (index: number) => {
  const icons = [Target, Palette, Globe, Plug, FileText];
  const IconComponent = icons[index] || Target;
  return <IconComponent className="w-6 h-6 text-primary" />;
};

export function GettingStarted({ title, items }: GettingStartedProps) {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      {getRequirementIcon(index)}
                    </motion.div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                        {item}
                      </p>
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
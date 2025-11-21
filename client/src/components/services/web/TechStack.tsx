import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Cloud, Cog, Monitor, Container } from "lucide-react";

interface TechStackProps {
  title: string;
  stack: string[];
}

const getTechIcon = (index: number) => {
  const icons = [Code, Code, Database, Code, Container, Monitor];
  const IconComponent = icons[index] || Code;
  return <IconComponent className="w-6 h-6 text-primary" />;
};

export function TechStack({ title, stack }: TechStackProps) {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stack.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      {getTechIcon(index)}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {tech}
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
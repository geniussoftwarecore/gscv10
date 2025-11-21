import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Users,
  Target,
  Star,
  Quote,
  CheckCircle,
  ArrowRight,
  BarChart,
  Zap,
  Shield
} from "lucide-react";
import type { PortfolioItem } from "@shared/schema";

interface ProjectDetailBodyProps {
  project: PortfolioItem;
}

export default function ProjectDetailBody({ project }: ProjectDetailBodyProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="project-details" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          
          {/* Problem & Solution */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Problem */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Target className="w-6 h-6 text-red-600" />
                  </div>
                  التحدي والمشكلة
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 leading-relaxed">
                <p>
                  {project.fullDescription || "تواجه الشركات الحديثة تحديات متزايدة في إدارة عملياتها الرقمية والوصول إلى عملائها بطريقة فعالة. كانت الحاجة ملحة لحل تقني متطور يجمع بين سهولة الاستخدام والأداء العالي لتحقيق النتائج المطلوبة في بيئة تنافسية."}
                </p>
              </CardContent>
            </Card>

            {/* Solution */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  الحل والتنفيذ
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 leading-relaxed">
                <p>
                  {project.description}
                </p>
                <div className="mt-6 space-y-3">
                  {project.services?.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Technologies & Architecture */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  التقنيات والهندسة المعمارية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.technologies?.map((tech, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{tech}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results & KPIs */}
          {project.kpis && project.kpis.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart className="w-6 h-6 text-purple-600" />
                    </div>
                    النتائج والإنجازات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {project.kpis.map((kpi, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="text-center p-6 bg-white rounded-xl shadow-md"
                      >
                        <div className="flex justify-center mb-4">
                          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-full">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-primary mb-2">
                          {kpi.value}
                        </div>
                        <div className="text-lg font-semibold text-gray-800 mb-1">
                          {kpi.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {kpi.description}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Client Testimonial */}
          {project.testimonial && (
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <Quote className="w-12 h-12 text-yellow-500" />
                  </div>
                  
                  <blockquote className="text-xl text-center text-gray-700 mb-6 leading-relaxed">
                    "{project.testimonial.content}"
                  </blockquote>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            project.testimonial && i < project.testimonial.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {project.client && (
                      <div>
                        <div className="font-semibold text-gray-900">
                          {project.testimonial.author || project.client.name}
                        </div>
                        <div className="text-gray-600">
                          {project.testimonial.position || project.client.position}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.client.company}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Project Stats */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <BarChart className="w-6 h-6 text-gray-600" />
                  </div>
                  معلومات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">مدة التطوير</div>
                    <div className="text-lg font-semibold">{project.duration}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">حجم الفريق</div>
                    <div className="text-lg font-semibold">{project.teamSize}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">سنة الإنجاز</div>
                    <div className="text-lg font-semibold">{project.year}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">القطاع</div>
                    <div className="text-lg font-semibold">{project.industry}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            variants={itemVariants}
            className="text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-white"
          >
            <h3 className="text-3xl font-bold mb-4">
              هل تريد مشروعاً مشابهاً؟
            </h3>
            <p className="text-xl mb-8 opacity-90">
              دعنا نساعدك في تحقيق نتائج استثنائية لمشروعك القادم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                ابدأ مشروعك الآن
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                تحدث مع فريقنا
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
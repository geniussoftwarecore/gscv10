import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Target,
  Lightbulb,
  Wrench,
  CheckCircle,
  TrendingUp,
  Users,
  Quote,
  Star,
  Award,
  ArrowRight,
  Calendar,
  Building
} from 'lucide-react';
import type { PortfolioProject } from '@/data/portfolio';

interface EnhancedProjectDetailContentProps {
  project: PortfolioProject;
}

export default function EnhancedProjectDetailContent({ project }: EnhancedProjectDetailContentProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="project-details" className="py-16 lg:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {/* Project Overview */}
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              نظرة عامة على المشروع
            </h2>
            <p className="text-lg text-brand-text-muted max-w-4xl mx-auto leading-relaxed">
              {project.descriptionAr}
            </p>
          </motion.div>

          {/* Challenge, Solution, Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenge */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-xl transition-all duration-400 h-full group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <Target className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-brand-text-primary">
                      التحدي
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-text-muted leading-relaxed">
                    {project.challengeAr}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Solution */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-xl transition-all duration-400 h-full group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Lightbulb className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-brand-text-primary">
                      الحل
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-brand-text-muted leading-relaxed">
                    {project.solutionAr}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-xl transition-all duration-400 h-full group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-brand-text-primary">
                      النتائج
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.resultsAr.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-brand-text-muted text-sm">{result}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Services and Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Services Provided */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-brand-sky-base bg-brand-bg hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-brand-sky-light rounded-lg flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-brand-sky-accent" />
                    </div>
                    <CardTitle className="text-xl font-bold text-brand-text-primary">
                      الخدمات المقدمة
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.servicesAr.map((service, index) => (
                      <motion.div
                        key={service}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 p-3 bg-brand-sky-light/50 rounded-lg border border-brand-sky-base hover:border-brand-sky-accent transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 text-brand-sky-accent flex-shrink-0" />
                        <span className="text-sm font-medium text-brand-text-primary">{service}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Features */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-brand-sky-base bg-brand-bg hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-brand-sky-light rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-brand-sky-accent" />
                    </div>
                    <CardTitle className="text-xl font-bold text-brand-text-primary">
                      الميزات الرئيسية
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.featuresAr.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-brand-sky-light/30 rounded-lg border border-brand-sky-base/50 hover:bg-brand-sky-light/50 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 text-brand-sky-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-brand-text-primary font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Client Testimonial */}
          {project.testimonial && (
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-brand-sky-base bg-gradient-to-br from-brand-sky-light/30 to-brand-bg hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-sky-accent/10 to-transparent" />
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-brand-sky-accent/20 rounded-full"
                      style={{
                        left: `${20 + (i * 15)}%`,
                        top: `${10 + (i * 10)}%`,
                      }}
                    />
                  ))}
                </div>

                <CardContent className="p-8 lg:p-12 relative z-10">
                  <div className="text-center max-w-4xl mx-auto">
                    {/* Quote Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, type: "spring" }}
                      className="w-16 h-16 bg-brand-sky-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Quote className="w-8 h-8 text-brand-sky-accent" />
                    </motion.div>

                    {/* Testimonial Content */}
                    <motion.blockquote
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg lg:text-xl text-brand-text-primary font-medium mb-8 leading-relaxed italic"
                    >
                      "{project.testimonial.contentAr}"
                    </motion.blockquote>

                    {/* Client Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-center gap-6"
                    >
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-brand-text-primary mb-1">
                          {project.testimonial.nameAr}
                        </h4>
                        <p className="text-brand-text-muted text-sm mb-2">
                          {project.testimonial.positionAr}
                        </p>
                        <div className="flex justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < project.testimonial!.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Project Metadata */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-brand-sky-base bg-brand-bg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-brand-text-primary text-center">
                  تفاصيل المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Client */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-sky-light rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Building className="w-6 h-6 text-brand-sky-accent" />
                    </div>
                    <h4 className="font-bold text-brand-text-primary mb-1">العميل</h4>
                    <p className="text-brand-text-muted text-sm">{project.clientAr}</p>
                  </div>

                  {/* Year */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-sky-light rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-brand-sky-accent" />
                    </div>
                    <h4 className="font-bold text-brand-text-primary mb-1">السنة</h4>
                    <p className="text-brand-text-muted text-sm">{project.year}</p>
                  </div>

                  {/* Duration */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-sky-light rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-brand-sky-accent" />
                    </div>
                    <h4 className="font-bold text-brand-text-primary mb-1">المدة</h4>
                    <p className="text-brand-text-muted text-sm">{project.durationAr}</p>
                  </div>

                  {/* Team Size */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-sky-light rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-brand-sky-accent" />
                    </div>
                    <h4 className="font-bold text-brand-text-primary mb-1">الفريق</h4>
                    <p className="text-brand-text-muted text-sm">{project.teamSize} أعضاء</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center">
            <Card className="border-2 border-brand-sky-base bg-gradient-to-br from-brand-sky-light/40 to-brand-bg shadow-xl">
              <CardContent className="p-12">
                <h3 className="text-2xl lg:text-3xl font-bold text-brand-text-primary mb-4">
                  مشروع مماثل لعملك؟
                </h3>
                <p className="text-lg text-brand-text-muted mb-8 max-w-2xl mx-auto">
                  دعنا نساعدك في تحقيق أهدافك التقنية من خلال حلول مبتكرة ومخصصة لاحتياجاتك
                </p>
                <Button 
                  size="lg"
                  className="bg-brand-sky-accent hover:bg-brand-sky-accent/90 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  ابدأ مشروعك الآن
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
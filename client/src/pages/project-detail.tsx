import { useParams } from "wouter";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { portfolioProjects } from "@/data/portfolio";
import { useLanguage } from "@/i18n/lang";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  ArrowRight,
  Quote,
  Star,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { dir } = useLanguage();

  const project = portfolioProjects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">المشروع غير موجود</h1>
          <p className="text-gray-600">عذراً، المشروع المطلوب غير موجود</p>
        </div>
      </div>
    );
  }

  const isRTL = dir === 'rtl';

  return (
    <>
      <PageHeader
        title={isRTL ? project.titleAr : project.title}
        subtitle={isRTL ? project.summaryAr : project.summaryEn}
        background="gradient"
      />

      <Section size="xl" background="white">
        <Container size="lg">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={project.coverImage.startsWith('@assets') ? project.coverImage.replace('@assets', '/attached_assets') : project.coverImage}
                  alt={isRTL ? project.titleAr : project.title}
                  className="w-full rounded-2xl shadow-2xl"
                  data-testid="img-project-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className={`text-3xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'نظرة عامة' : 'Overview'}
                </h2>
                <p className={`text-lg text-gray-700 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? project.descriptionAr : project.descriptionEn}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className={`text-3xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'التحدي' : 'The Challenge'}
                </h2>
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-0">
                  <CardContent className="p-8">
                    <p className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? project.challengeAr : project.challengeEn}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className={`text-3xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'الحل' : 'The Solution'}
                </h2>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                  <CardContent className="p-8">
                    <p className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? project.solutionAr : project.solutionEn}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className={`text-3xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'الميزات الرئيسية' : 'Key Features'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {(isRTL ? project.featuresAr : project.features).map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {project.gallery && project.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h2 className={`text-3xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'معرض الصور' : 'Gallery'}
                  </h2>
                  <div className={cn(
                    "grid gap-6",
                    project.slug === 'peregrine-complaint-management'
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
                      : "md:grid-cols-2"
                  )}>
                    {project.gallery.map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                      >
                        <img
                          src={image.url.replace('@assets/', '/attached_assets/')}
                          alt={isRTL ? image.altAr : image.alt}
                          className={cn(
                            "w-full transition-transform duration-500",
                            project.slug === 'peregrine-complaint-management'
                              ? "h-auto max-h-[500px] object-contain bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 group-hover:scale-105"
                              : "h-64 object-cover group-hover:scale-110"
                          )}
                          data-testid={`img-gallery-${index}`}
                          onError={(e) => {
                            console.error('Image failed to load:', image.url);
                            e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                          }}
                        />
                        {(image.caption || image.captionAr) && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm">{isRTL ? image.captionAr : image.caption}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className={`text-3xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'النتائج' : 'Results'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {(isRTL ? project.resultsAr : project.results).map((result, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-6 flex items-start gap-3">
                        <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <span className="text-gray-700 font-medium">{result}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {project.testimonial && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                    <CardContent className="p-8">
                      <Quote className="w-12 h-12 text-primary mb-4" />
                      <p className={`text-lg text-gray-700 mb-6 italic ${isRTL ? 'text-right' : 'text-left'}`}>
                        "{isRTL ? project.testimonial.contentAr : project.testimonial.content}"
                      </p>
                      <div className="flex items-center gap-4">
                        {project.clientLogo && (
                          <img 
                            src={project.clientLogo.replace('@assets/', '/attached_assets/')} 
                            alt={isRTL ? project.clientAr : project.client}
                            className="w-16 h-16 object-contain"
                            data-testid="img-client-logo"
                          />
                        )}
                        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <p className="font-bold text-gray-900">
                            {isRTL ? project.testimonial.nameAr : project.testimonial.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {isRTL ? project.testimonial.positionAr : project.testimonial.position}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: project.testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className={`font-bold text-lg mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'تفاصيل المشروع' : 'Project Details'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">{isRTL ? 'العميل' : 'Client'}</p>
                        <p className="font-medium">{isRTL ? project.clientAr : project.client}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">{isRTL ? 'السنة' : 'Year'}</p>
                        <p className="font-medium">{project.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">{isRTL ? 'المدة' : 'Duration'}</p>
                        <p className="font-medium">{isRTL ? project.durationAr : project.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">{isRTL ? 'حجم الفريق' : 'Team Size'}</p>
                        <p className="font-medium">{project.teamSize} {isRTL ? 'أعضاء' : 'Members'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className={`font-bold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'الخدمات المقدمة' : 'Services Provided'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(isRTL ? project.servicesAr : project.services).map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className={`font-bold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'التقنيات المستخدمة' : 'Technologies Used'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-primary text-primary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {project.kpis && project.kpis.length > 0 && (
                    <div className="pt-6 border-t">
                      <h4 className={`font-bold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {isRTL ? 'المؤشرات الرئيسية' : 'Key Metrics'}
                      </h4>
                      <div className="space-y-4">
                        {project.kpis.map((kpi) => (
                          <div key={kpi.id} className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-600">
                                {isRTL ? kpi.labelAr : kpi.label}
                              </p>
                              <TrendingUp className={cn(
                                "w-4 h-4",
                                kpi.trend === 'up' ? "text-green-600" : kpi.trend === 'down' ? "text-blue-600" : "text-gray-600"
                              )} />
                            </div>
                            <p className="text-3xl font-bold text-primary mb-1">{kpi.value}</p>
                            <p className="text-xs text-gray-500">
                              {isRTL ? kpi.descriptionAr : kpi.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.websiteUrl && (
                    <div className="pt-6 border-t">
                      <a 
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="link-website"
                      >
                        <Button className="w-full" size="lg">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {isRTL ? 'زيارة الموقع' : 'Visit Website'}
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section size="lg" background="gradient">
        <Container size="md" className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              {isRTL ? 'هل لديك مشروع مشابه؟' : 'Have a Similar Project?'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {isRTL 
                ? 'دعنا نتعاون لتحويل أفكارك إلى واقع رقمي مبتكر' 
                : 'Let\'s collaborate to turn your ideas into innovative digital reality'}
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" data-testid="button-contact">
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
              <ArrowRight className={cn("w-5 h-5", isRTL ? "mr-2 rotate-180" : "ml-2")} />
            </Button>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}

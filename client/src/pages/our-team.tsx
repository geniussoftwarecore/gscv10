import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from "@/i18n/lang";
import { cn } from '@/lib/utils';
import { MetaTags } from '@/components/seo/meta-tags';
import { 
  Mail, 
  Linkedin, 
  Github,
  Award,
  Users,
  Target,
  Trophy
} from 'lucide-react';

const teamMembers = [
  {
    id: '1',
    name: {
      ar: 'أحمد محمد علي',
      en: 'Ahmed Mohammed Ali'
    },
    position: {
      ar: 'المدير التنفيذي',
      en: 'Chief Executive Officer'
    },
    bio: {
      ar: 'خبرة تزيد عن 15 عاماً في تطوير البرمجيات وقيادة الفرق التقنية',
      en: 'Over 15 years of experience in software development and technical team leadership'
    },
    image: '/team/ceo.jpg',
    email: 'ahmed@geniussoftwarecore.com',
    linkedin: 'https://linkedin.com/in/ahmed-ali',
    specialties: [
      { ar: 'القيادة التقنية', en: 'Technical Leadership' },
      { ar: 'إدارة المشاريع', en: 'Project Management' },
      { ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence' }
    ]
  },
  {
    id: '2', 
    name: {
      ar: 'فاطمة أحمد حسن',
      en: 'Fatima Ahmed Hassan'
    },
    position: {
      ar: 'مديرة التقنية',
      en: 'Chief Technology Officer'
    },
    bio: {
      ar: 'متخصصة في الهندسة المعمارية للبرمجيات والحلول السحابية',
      en: 'Specialist in software architecture and cloud solutions'
    },
    image: '/team/cto.jpg',
    email: 'fatima@geniussoftwarecore.com',
    github: 'https://github.com/fatima-hassan',
    specialties: [
      { ar: 'الحوسبة السحابية', en: 'Cloud Computing' },
      { ar: 'الأمن السيبراني', en: 'Cybersecurity' },
      { ar: 'DevOps', en: 'DevOps' }
    ]
  },
  {
    id: '3',
    name: {
      ar: 'محمد سامي رضوان',
      en: 'Mohammed Samy Radwan'
    },
    position: {
      ar: 'مطور واجهات أمامية رئيسي',
      en: 'Senior Frontend Developer'
    },
    bio: {
      ar: 'خبير في تطوير تطبيقات الويب الحديثة وتجربة المستخدم',
      en: 'Expert in modern web application development and user experience'
    },
    image: '/team/frontend-dev.jpg',
    email: 'mohammed@geniussoftwarecore.com',
    github: 'https://github.com/mohammed-samy',
    specialties: [
      { ar: 'React & Next.js', en: 'React & Next.js' },
      { ar: 'تجربة المستخدم', en: 'User Experience' },
      { ar: 'التصميم التفاعلي', en: 'Interactive Design' }
    ]
  },
  {
    id: '4',
    name: {
      ar: 'سارة خالد منصور',
      en: 'Sara Khaled Mansour'
    },
    position: {
      ar: 'مطورة خلفية رئيسية',
      en: 'Senior Backend Developer'
    },
    bio: {
      ar: 'متخصصة في تطوير APIs وقواعد البيانات وأنظمة التوزيع',
      en: 'Specialist in API development, databases, and distributed systems'
    },
    image: '/team/backend-dev.jpg',
    email: 'sara@geniussoftwarecore.com',
    github: 'https://github.com/sara-mansour',
    specialties: [
      { ar: 'Node.js & Python', en: 'Node.js & Python' },
      { ar: 'قواعد البيانات', en: 'Databases' },
      { ar: 'الأنظمة الموزعة', en: 'Distributed Systems' }
    ]
  }
];

const stats = [
  {
    icon: Users,
    value: '50+',
    label: { ar: 'عضو فريق', en: 'Team Members' }
  },
  {
    icon: Award,
    value: '100+',
    label: { ar: 'مشروع مكتمل', en: 'Completed Projects' }
  },
  {
    icon: Target,
    value: '98%',
    label: { ar: 'معدل رضا العملاء', en: 'Client Satisfaction' }
  },
  {
    icon: Trophy,
    value: '5+',
    label: { ar: 'سنوات خبرة', en: 'Years Experience' }
  }
];

export default function OurTeam() {
  const { lang, dir } = useLanguage();

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800")}>
      <MetaTags 
        title={language === 'ar' ? 'فريقنا - جينيوس سوفت وير كور' : 'Our Team - Genius Software Core'}
        description={language === 'ar' 
          ? 'تعرف على فريق الخبراء في جينيوس سوفت وير كور وخبراتهم في تطوير البرمجيات'
          : 'Meet our expert team at Genius Software Core and their expertise in software development'
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
              "bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' ? 'فريقنا المتميز' : 'Our Amazing Team'}
            </h1>
            <p className={cn(
              "text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' 
                ? 'مجموعة من الخبراء المتفانين في تقديم أفضل الحلول التقنية وتحقيق رؤية عملائنا'
                : 'A dedicated group of experts committed to delivering the best technical solutions and realizing our clients\' vision'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <stat.icon className="h-8 w-8 text-sky-600 dark:text-sky-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className={cn(
                      "text-sm text-slate-600 dark:text-slate-300",
                      dir ? "font-cairo" : "font-inter"
                    )}>
                      {stat.label[language]}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={cn(
              "text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' ? 'أعضاء الفريق' : 'Team Members'}
            </h2>
            <p className={cn(
              "text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' 
                ? 'تعرف على الخبراء الذين يقودون الابتكار في مجال التكنولوجيا'
                : 'Meet the experts who drive innovation in technology'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Member Image */}
                    <div className="aspect-square bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                        <Users className="h-12 w-12 text-sky-600" />
                      </div>
                    </div>
                    
                    {/* Member Info */}
                    <div className="p-6">
                      <h3 className={cn(
                        "text-lg font-semibold text-slate-900 dark:text-white mb-1",
                        dir ? "font-cairo" : "font-inter"
                      )}>
                        {member.name[language]}
                      </h3>
                      <p className="text-sky-600 dark:text-sky-400 text-sm mb-3">
                        {member.position[language]}
                      </p>
                      <p className={cn(
                        "text-sm text-slate-600 dark:text-slate-300 mb-4",
                        dir ? "font-cairo" : "font-inter"
                      )}>
                        {member.bio[language]}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {member.specialties.map((specialty, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {specialty[language]}
                          </Badge>
                        ))}
                      </div>

                      {/* Contact Links */}
                      <div className="flex gap-2">
                        <motion.a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-900 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          data-testid={`contact-email-${member.id}`}
                        >
                          <Mail className="h-4 w-4" />
                        </motion.a>
                        {member.linkedin && (
                          <motion.a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-900 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            data-testid={`contact-linkedin-${member.id}`}
                          >
                            <Linkedin className="h-4 w-4" />
                          </motion.a>
                        )}
                        {member.github && (
                          <motion.a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-900 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            data-testid={`contact-github-${member.id}`}
                          >
                            <Github className="h-4 w-4" />
                          </motion.a>
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

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={cn(
              "text-3xl md:text-4xl font-bold text-white mb-6",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' ? 'هل تريد الانضمام إلى فريقنا؟' : 'Want to Join Our Team?'}
            </h2>
            <p className={cn(
              "text-lg text-sky-100 mb-8 max-w-2xl mx-auto",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' 
                ? 'نحن دائماً نبحث عن المواهب المتميزة للانضمام إلى رحلتنا في الابتكار'
                : 'We\'re always looking for exceptional talent to join our innovation journey'
              }
            </p>
            <motion.a
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-white text-sky-600 rounded-lg font-medium hover:bg-slate-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-join-team"
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
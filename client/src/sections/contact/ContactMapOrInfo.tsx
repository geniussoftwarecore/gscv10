import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/lang";
import { COMPANY_INFO } from "@/lib/constants";

export function ContactMapOrInfo() {
  const { dir } = useLanguage();

  const businessInfo = [
    {
      icon: MapPin,
      title: dir === 'rtl' ? 'موقعنا' : 'Our Location',
      details: dir === 'rtl' ? COMPANY_INFO.address : COMPANY_INFO.addressEn,
      description: dir === 'rtl' ? 'مكتبنا الرئيسي' : 'Our main office',
    },
    {
      icon: Clock,
      title: dir === 'rtl' ? 'ساعات العمل' : 'Working Hours',
      details: COMPANY_INFO.workingHours,
      description: dir === 'rtl' ? 'متاحون للطوارئ خارج أوقات العمل' : 'Available for emergencies outside working hours',
    },
    {
      icon: Phone,
      title: dir === 'rtl' ? 'تواصل سريع' : 'Quick Contact',
      details: `${COMPANY_INFO.phone} / ${COMPANY_INFO.phoneSecondary}`,
      description: dir === 'rtl' ? 'اتصال مباشر أو رسائل واتساب' : 'Direct call or WhatsApp messages',
    },
    {
      icon: Mail,
      title: dir === 'rtl' ? 'استفسارات العمل' : 'Business Inquiries',
      details: COMPANY_INFO.email,
      description: dir === 'rtl' ? 'للاستفسارات والمشاريع الجديدة' : 'For inquiries and new projects',
    },
  ];

  return (
    <Section size="xl" background="white">
      <Container size="lg">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <AnimatedSection delay={0.3}>
            <div className="space-y-6">
              <div className="text-center lg:text-right">
                <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                  {dir === 'rtl' ? 'معلومات التواصل' : 'Contact Information'}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {dir === 'rtl' 
                    ? 'نحن هنا لمساعدتك في تحقيق أهدافك التقنية. تواصل معنا بأي طريقة تناسبك'
                    : 'We\'re here to help you achieve your technical goals. Contact us in any way that suits you'
                  }
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {businessInfo.map((info, index) => (
                  <AnimatedCard key={index} delay={index * 0.1} className="p-6" hover={true}>
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <info.icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-secondary mb-1">
                            {info.title}
                          </h3>
                          <p className="text-primary font-semibold text-sm mb-1">
                            {info.details}
                          </p>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Map Placeholder */}
          <AnimatedSection delay={0.5}>
            <Card className="overflow-hidden shadow-2xl border-0 rounded-2xl h-96">
              <CardContent className="p-0 h-full">
                <div className="h-full bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-32 h-32 border-2 border-primary rounded-full"></div>
                    <div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-primary rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary rounded-full"></div>
                  </div>
                  
                  {/* Center Content */}
                  <div className="text-center z-10 p-8">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">
                      {dir === 'rtl' ? 'موقعنا على الخريطة' : 'Our Location'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed max-w-xs">
                      {dir === 'rtl' 
                        ? 'في قلب صنعاء، نخدم عملاءنا من جميع أنحاء اليمن والمنطقة'
                        : 'In the heart of Sana\'a, serving clients throughout Yemen and the region'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Container>
    </Section>
  );
}
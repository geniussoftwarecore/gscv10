import { PageHeaderContact } from "@/sections/contact/PageHeaderContact";
import { ContactChannels } from "@/sections/contact/ContactChannels";
import { ContactForm } from "@/sections/contact/ContactForm";
import { ContactMapOrInfo } from "@/sections/contact/ContactMapOrInfo";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/i18n/lang";
import { motion } from "framer-motion";

export default function Contact() {
  const { dir } = useLanguage();

  return (
    <>
      <SEOHead 
        title={dir === 'rtl' ? 'تواصل معنا - جينيوس سوفت وير كور' : 'Contact Us - Genius Software Core'}
        description={dir === 'rtl' ? 'تواصل مع فريق جينيوس سوفت وير كور للحصول على حلول تقنية متطورة. نحن هنا لمساعدتك في تحقيق أهدافك التقنية.' : 'Contact Genius Software Core team for advanced technical solutions. We\'re here to help you achieve your technical goals.'}
      />
      
      <motion.div 
        className="min-h-screen"
        dir={dir}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <PageHeaderContact />
        <ContactChannels />
        <ContactForm />
        <ContactMapOrInfo />
      </motion.div>
    </>
  );
}
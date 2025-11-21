import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

export function SocialProof() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  // Sample testimonial data with bilingual support
  const testimonial = {
    quote: dir === 'rtl' 
      ? 'جينيوس سوفت وير كور حول رؤيتنا إلى واقع رقمي متطور ساعدنا في تحسين كفاءة أعمالنا بشكل كبير'
      : 'Genius Software Core transformed our vision into an advanced digital reality that helped us significantly improve our business efficiency',
    author: dir === 'rtl' ? 'أحمد محمد، مدير تقني' : 'Ahmed Mohammed, Technical Manager',
    company: dir === 'rtl' ? 'شركة التقنية المتطورة' : 'Advanced Tech Company',
    rating: 5
  };

  // Sample client logos/companies
  const clients = [
    { name: 'TechCorp', logo: '/api/placeholder/120/60' },
    { name: 'InnovatePro', logo: '/api/placeholder/120/60' },
    { name: 'DigitalFirst', logo: '/api/placeholder/120/60' },
    { name: 'SmartSolutions', logo: '/api/placeholder/120/60' },
    { name: 'FutureWorks', logo: '/api/placeholder/120/60' },
    { name: 'NextGen', logo: '/api/placeholder/120/60' }
  ];

  return (
    <section className="py-20 bg-brand-sky-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-primary mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('proof.title')}
          </motion.h2>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-brand-sky-base relative overflow-hidden">
            {/* Quote Icon */}
            <motion.div
              className="absolute top-6 right-6 opacity-10"
              initial={{ scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Quote className="w-16 h-16 text-primary" />
            </motion.div>

            <div className={cn(
              "grid md:grid-cols-4 gap-8 items-center",
              dir === 'rtl' && "md:grid-cols-4"
            )}>
              {/* Avatar */}
              <motion.div
                className="flex justify-center md:justify-start"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {testimonial.author.charAt(0)}
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                className="md:col-span-3 text-center md:text-start"
                initial={{ opacity: 0, x: dir === 'rtl' ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
              >
                {/* Stars */}
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-brand-text-primary mb-6 leading-relaxed font-medium">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className={cn(
                  "text-brand-text-muted",
                  dir === 'rtl' && "md:text-right"
                )}>
                  <p className="font-semibold text-brand-text-primary">{testimonial.author}</p>
                  <p className="text-sm">{testimonial.company}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Client Logos */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <p className="text-brand-text-muted font-medium">
              {dir === 'rtl' ? 'يثق بنا أكثر من 50+ شركة رائدة' : 'Trusted by 50+ leading companies'}
            </p>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-24 h-12 bg-white rounded-lg shadow-sm border border-brand-sky-base flex items-center justify-center group hover:border-primary transition-colors duration-300">
                  <span className="text-sm font-medium text-brand-text-muted group-hover:text-primary transition-colors duration-300">
                    {client.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
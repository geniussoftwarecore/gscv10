import { Link } from "wouter";
import { motion } from "framer-motion";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { AnimatedSection, AnimatedText } from "@/components/ui/animated-card";

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryAction: {
    text: string;
    href: string;
    icon?: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
    icon?: string;
  };
  backgroundType?: "gradient" | "image" | "solid";
  backgroundImage?: string;
  className?: string;
}

export function CTASection({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  backgroundType = "gradient",
  backgroundImage,
  className,
}: CTASectionProps) {
  const getBackgroundClass = () => {
    switch (backgroundType) {
      case "gradient":
        return "gradient-primary";
      case "image":
        return backgroundImage ? "bg-cover bg-center" : "gradient-primary";
      case "solid":
        return "bg-primary";
      default:
        return "gradient-primary";
    }
  };

  return (
    <section 
      className={`py-16 lg:py-24 text-white relative overflow-hidden ${getBackgroundClass()} ${className}`}
      style={backgroundType === "image" && backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      {/* Background overlay for image */}
      {backgroundType === "image" && (
        <div className="absolute inset-0 bg-black/60"></div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-xl"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatedSection delay={0.2}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-bold mb-6"
          >
            {title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-10 leading-relaxed opacity-90 max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={primaryAction.href}>
              <InteractiveButton
                className="bg-white text-primary hover:bg-gray-100 shadow-xl hover:shadow-2xl px-8 py-4 text-lg"
                icon={primaryAction.icon ? <i className={primaryAction.icon}></i> : undefined}
              >
                {primaryAction.text}
              </InteractiveButton>
            </Link>

            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <InteractiveButton
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg"
                  icon={secondaryAction.icon ? <i className={secondaryAction.icon}></i> : undefined}
                >
                  {secondaryAction.text}
                </InteractiveButton>
              </Link>
            )}
          </motion.div>
        </AnimatedSection>

        {/* Floating action indicators */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-12"
        >
          <i className="fas fa-arrow-down text-white/60 text-2xl animate-bounce"></i>
        </motion.div>
      </div>
    </section>
  );
}

// Preset CTA sections for common use cases
export const CTAPresets = {
  contact: {
    title: "جاهز للبدء؟",
    subtitle: "تواصل معنا اليوم واحصل على استشارة مجانية لمشروعك التقني",
    primaryAction: {
      text: "ابدأ مشروعك الآن",
      href: "/contact",
      icon: "fas fa-rocket",
    },
    secondaryAction: {
      text: "شاهد أعمالنا",
      href: "/portfolio", 
      icon: "fas fa-eye",
    },
  },
  services: {
    title: "هل تحتاج مساعدة في مشروعك؟",
    subtitle: "استكشف خدماتنا المتنوعة واختر ما يناسب احتياجاتك",
    primaryAction: {
      text: "استكشف خدماتنا",
      href: "/services",
      icon: "fas fa-cogs",
    },
    secondaryAction: {
      text: "تحدث معنا",
      href: "/contact",
      icon: "fas fa-comment",
    },
  },
  portfolio: {
    title: "مستوحى من أعمالنا؟",
    subtitle: "شاهد المزيد من مشاريعنا الناجحة وكيف ساعدنا عملاءنا على تحقيق أهدافهم",
    primaryAction: {
      text: "شاهد جميع المشاريع",
      href: "/portfolio",
      icon: "fas fa-folder-open",
    },
    secondaryAction: {
      text: "ابدأ مشروعك",
      href: "/contact",
      icon: "fas fa-plus",
    },
  },
};
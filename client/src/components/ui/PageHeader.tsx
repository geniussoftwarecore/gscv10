import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Home, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { href: string; label: string }[];
  background?: "light" | "gradient";
  className?: string;
  children?: ReactNode;
}

/**
 * Standardized page header following Services/Home design
 */
export function PageHeader({ 
  title, 
  subtitle,
  breadcrumbs = [],
  background = "light",
  className = "",
  children
}: PageHeaderProps) {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  const backgroundClass = background === "gradient" 
    ? "bg-gradient-to-r from-primary to-primary-dark text-white"
    : "bg-gradient-to-br from-brand-bg via-brand-sky-light to-brand-sky-base";

  return (
    <section className={cn(
      "relative py-20 overflow-hidden",
      backgroundClass,
      className
    )}>
      {/* Background Elements - matching Services/Home */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 rtl:right-10 ltr:left-10 w-80 h-80 bg-brand-sky-accent rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 rtl:left-10 ltr:right-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Container className="relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <motion.nav
            className={cn(
              "flex items-center gap-2 mb-8",
              background === "gradient" ? "text-white/90" : "text-brand-text-muted"
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            dir={dir}
          >
            <Link href="/" className={cn(
              "flex items-center gap-2 hover:opacity-75 transition-opacity duration-300",
              background === "gradient" ? "text-white/90 hover:text-white" : "hover:text-primary"
            )}>
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight 
                  className={cn(
                    "w-4 h-4",
                    dir === 'rtl' && "rotate-180"
                  )} 
                />
                {index === breadcrumbs.length - 1 ? (
                  <span className={cn(
                    "font-medium",
                    background === "gradient" ? "text-white" : "text-brand-text-primary"
                  )}>
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className={cn(
                    "transition-opacity duration-300",
                    background === "gradient" ? "text-white/90 hover:text-white" : "hover:text-primary"
                  )}>
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </motion.nav>
        )}

        {/* Header Content */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Title */}
          <motion.h1
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight",
              background === "gradient" ? "text-white" : "text-brand-text-primary"
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className={cn(
                "text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6",
                background === "gradient" ? "text-white/90" : "text-brand-text-muted"
              )}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Custom Content */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <motion.div
          className={cn(
            "w-6 h-10 border-2 rounded-full flex justify-center",
            background === "gradient" ? "border-white/70" : "border-brand-text-muted"
          )}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className={cn(
              "w-1 h-3 rounded-full mt-2",
              background === "gradient" ? "bg-white/70" : "bg-brand-text-muted"
            )}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
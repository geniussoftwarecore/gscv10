import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function Hero() {
  const { dir, lang } = useLanguage();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-bg via-brand-sky-light to-brand-sky-base">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 rtl:right-10 ltr:left-10 w-72 h-72 bg-brand-sky-accent rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 rtl:left-10 ltr:right-10 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            y: [0, 30, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            className={cn(
              "text-center lg:text-start",
              dir === "rtl" && "lg:text-right"
            )}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Hero Logo */}
            <motion.div
              className="flex justify-center lg:justify-start mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Glow effect background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-brand-sky-accent/20 rounded-2xl blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
                
                {/* Logo with enhanced styling */}
                <motion.img
                  src="/brand/logo-gsc-hero.png"
                  alt={t('brand.name')}
                  className="relative h-24 md:h-32 lg:h-40 w-auto drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                  width={192}
                  height={96}
                  loading="eager"
                  whileHover={{ 
                    filter: "brightness(1.1) contrast(1.05)",
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Interactive shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-text-primary mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t('hero.title')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-brand-text-muted mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link href="/services/be5527f7-3381-48f8-9ff2-21132038ae59">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold"
                  data-testid="hero-primary-cta"
                >
                  {t('hero.primaryCta')}
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl transition-all duration-300 text-base font-semibold"
                  data-testid="hero-secondary-cta"
                >
                  {t('hero.secondaryCta')}
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm text-brand-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {t('hero.response24h')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {t('hero.trustedBy')}
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Section - ERPNext Dashboard Mockup */}
          <motion.div
            className="relative lg:block hidden"
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Main Dashboard Container */}
              <div className="bg-white rounded-2xl shadow-2xl p-4 transform hover:scale-105 transition-transform duration-500">
                <div className="space-y-4">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {lang === 'ar' ? 'لوحة تحكم ERPNext' : 'ERPNext Dashboard'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <motion.div 
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">
                          {lang === 'ar' ? 'المبيعات' : 'Sales'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">$45.2K</p>
                      <p className="text-xs text-green-600">+12.5%</p>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">
                          {lang === 'ar' ? 'المخزون' : 'Inventory'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">1,234</p>
                      <p className="text-xs text-gray-500">{lang === 'ar' ? 'منتج' : 'items'}</p>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">
                          {lang === 'ar' ? 'العملاء' : 'Customers'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">856</p>
                      <p className="text-xs text-green-600">+8.2%</p>
                    </motion.div>
                  </div>

                  {/* ERP Modules Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <motion.div 
                      className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">
                            {lang === 'ar' ? 'الحسابات' : 'Accounting'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {lang === 'ar' ? '48 فاتورة' : '48 invoices'}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 border border-teal-200"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">
                            {lang === 'ar' ? 'الموارد البشرية' : 'HR & Payroll'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {lang === 'ar' ? '124 موظف' : '124 employees'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Chart Visualization */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-900">
                        {lang === 'ar' ? 'أداء المبيعات' : 'Sales Performance'}
                      </span>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="w-2 h-2 bg-brand-sky-accent rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-end gap-1 h-16">
                      <motion.div 
                        className="flex-1 bg-primary rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: "45%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      <motion.div 
                        className="flex-1 bg-primary rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: "65%" }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                      <motion.div 
                        className="flex-1 bg-primary rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: "40%" }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                      <motion.div 
                        className="flex-1 bg-brand-sky-accent rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: "80%" }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                      <motion.div 
                        className="flex-1 bg-brand-sky-accent rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: "90%" }}
                        transition={{ duration: 1, delay: 0.9 }}
                      />
                      <motion.div 
                        className="flex-1 bg-brand-sky-accent rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 1, delay: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Module Icons */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg flex items-center justify-center"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-brand-sky-accent to-brand-sky-base rounded-lg shadow-lg flex items-center justify-center"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-6 w-8 h-8 bg-green-500 rounded-full shadow-lg flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-brand-text-muted rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-brand-text-muted rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
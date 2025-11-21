import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/lang";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useTranslation } from "@/hooks/useTranslation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { dir } = useLanguage();
  const { t } = useTranslation();

  // Navigation items with translation support and preload keys
  const navigationItems = [
    { 
      href: "/", 
      label: t('nav.home'),
      preload: null
    },
    { 
      href: "/services", 
      label: t('nav.services'),
      preload: "nav-services"
    },
    { 
      href: "/portfolio", 
      label: t('nav.portfolio'),
      preload: "nav-portfolio"
    },
    { 
      href: "/about", 
      label: t('nav.about'),
      preload: "nav-about"
    },
    { 
      href: "/contact", 
      label: t('nav.contact'),
      preload: "nav-contact"
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if route is active
  const isActiveRoute = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav 
      className="sticky top-0 z-50 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60"
      dir={dir}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          
          {/* Left section: Logo + Brand Text */}
          <Link href="/">
            <motion.div 
              className="flex items-center gap-2 md:gap-3 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Interactive Logo Container */}
              <motion.div
                className="relative"
                whileHover={{ 
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.6, ease: "easeInOut" }
                }}
              >
                {/* Animated Background Glow */}
                <motion.div
                  className="absolute inset-0 bg-sky-400/20 rounded-full blur-md -z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ 
                    scale: 1.5, 
                    opacity: 1,
                    transition: { duration: 0.3 }
                  }}
                />
                
                {/* Logo with Bounce Effect */}
                <motion.img 
                  src="/brand/logo-gsc-48.png" 
                  alt="GSC" 
                  className="h-10 w-auto md:h-12"
                  width={48}
                  height={48}
                  style={{ height: '40px' }}
                  whileHover={{ 
                    y: [-2, -4, -2],
                    transition: { duration: 0.5, ease: "easeInOut" }
                  }}
                />
                
                {/* Sparkle Effects */}
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-sky-400 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    transition: { duration: 0.8, delay: 0.2 }
                  }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-sky-300 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    transition: { duration: 0.6, delay: 0.4 }
                  }}
                />
              </motion.div>
              
              {/* Brand Text with Color Animation */}
              <motion.span 
                className={cn(
                  "font-medium tracking-tight transition-all duration-300",
                  "text-base md:text-lg",
                  dir ? "font-cairo" : "font-inter"
                )}
                whileHover={{
                  color: "#0ea5e9", // sky-500
                  textShadow: "0 0 8px rgba(14, 165, 233, 0.3)"
                }}
                initial={{ color: "rgb(15 23 42)" }} // slate-900
                style={{ color: "var(--foreground)" }}
              >
                {t('brand.name')}
              </motion.span>
            </motion.div>
          </Link>

          {/* Middle section: Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className={cn(
                    "relative px-3 py-2 text-sm lg:text-base font-medium rounded-md transition-colors duration-200 cursor-pointer",
                    isActiveRoute(item.href)
                      ? "text-sky-600 dark:text-sky-400"
                      : "text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400"
                  )}
                  data-preload={item.preload}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                  
                  {/* Active route indicator */}
                  {isActiveRoute(item.href) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Hover underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-400 dark:bg-slate-500 rounded-full opacity-0"
                    whileHover={{ opacity: isActiveRoute(item.href) ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right section: Language Toggle & Auth Buttons */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-sm font-medium border-slate-300 dark:border-slate-600 hover:border-sky-600 dark:hover:border-sky-400"
                  data-testid="button-dashboard"
                >
                  {t('auth.dashboard')}
                </Button>
              </Link>
            ) : (
              <>
                {/* Login Button - Outline Style */}
                <Link href="/login">
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative"
                  >
                    {/* Animated Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-sky-600/10 rounded-lg opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="relative h-9 px-4 text-sm font-medium border-2 border-sky-500/20 text-sky-600 hover:border-sky-500 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-400/30 dark:hover:border-sky-400 dark:hover:bg-sky-900/20 rounded-lg transition-all duration-300 group overflow-hidden"
                      data-testid="button-login"
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10">{t('auth.login')}</span>
                    </Button>
                  </motion.div>
                </Link>
                
                {/* Register Button - Gradient Style */}
                <Link href="/register">
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative"
                  >
                    {/* Glowing Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-600 rounded-lg blur-sm opacity-0"
                      whileHover={{ opacity: 0.3 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <Button
                      size="sm"
                      className="relative h-9 px-4 text-sm font-semibold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border-0"
                      data-testid="button-create-account"
                    >
                      {/* Animated Gradient Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-500 opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Sparkle Effect */}
                      <motion.div
                        className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0 }}
                        whileHover={{ 
                          scale: [0, 1, 0],
                          transition: { duration: 0.8, delay: 0.2 }
                        }}
                      />
                      
                      <span className="relative z-10">{t('auth.createAccount')}</span>
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={cn(
                "md:hidden p-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              )}
              aria-label={t('nav.toggleMenu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div 
                className="py-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-lg mx-2 mb-2 border border-slate-200/60 dark:border-slate-700/60"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* Mobile Navigation Links */}
                <div className="px-4 space-y-1">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: dir ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                      <Link href={item.href} onClick={closeMobileMenu}>
                        <span
                          className={cn(
                            "block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer",
                            isActiveRoute(item.href)
                              ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30"
                              : "text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Auth Buttons */}
                {!isAuthenticated && (
                  <motion.div 
                    className="px-4 pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Link href="/login" onClick={closeMobileMenu}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-center h-11 text-sm font-medium border-2 border-sky-500/30 text-sky-600 hover:border-sky-500 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-400/30 dark:hover:bg-sky-900/20 rounded-xl transition-all duration-300"
                          data-testid="mobile-button-login"
                        >
                          {t('auth.login')}
                        </Button>
                      </motion.div>
                    </Link>
                    
                    <Link href="/register" onClick={closeMobileMenu}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          className="w-full justify-center h-11 text-sm font-semibold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          data-testid="mobile-button-create-account"
                        >
                          {t('auth.createAccount')}
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
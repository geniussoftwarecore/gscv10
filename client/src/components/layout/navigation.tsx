import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  UserPlus, 
  Star, 
  Home as HomeIcon, 
  Settings, 
  Shield, 
  LogOut 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const navigationItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/services", label: "خدماتنا" },
    { href: "/portfolio", label: "أعمالنا" },
    { href: "/frameworks", label: "أطرنا التقنية" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center gap-3 h-12"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* GSC Logo - Enhanced Size and Effects */}
              <motion.img 
                src="/brand/logo-gsc-new.png" 
                onError={(e: any) => (e.currentTarget.src = "/brand/logo-gsc-icon.png")}
                alt="GSC" 
                className="h-12 w-auto md:h-14 lg:h-16 xl:h-18"
                width={72}
                height={72}
                whileHover={{ 
                  scale: 1.15,
                  rotate: [0, 8, -8, 0],
                  filter: "brightness(1.2) saturate(1.3) hue-rotate(5deg)"
                }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                style={{
                  filter: "drop-shadow(0 6px 16px rgba(14, 165, 233, 0.35))"
                }}
              />
              {/* Company Name - Harmonized with Logo */}
              <motion.div 
                className="hidden md:flex flex-col justify-center relative"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.08 }}
              >
                {/* Background glow effect matching logo */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-blue-500/20 to-sky-600/20 rounded-lg blur-lg opacity-0"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <motion.span 
                  className="font-black tracking-wider text-2xl lg:text-3xl xl:text-4xl leading-none whitespace-nowrap relative z-10"
                  style={{
                    fontFamily: "'Inter', 'Cairo', sans-serif",
                    background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 40%, #1e40af 70%, #0f172a 100%)",
                    backgroundSize: "200% 200%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 2px 8px rgba(14, 165, 233, 0.3))",
                    letterSpacing: "0.15em"
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  whileHover={{
                    scale: 1.12,
                    filter: "drop-shadow(0 4px 16px rgba(14, 165, 233, 0.6))",
                    textShadow: "0 0 20px rgba(14, 165, 233, 0.8)"
                  }}
                >
                  GSC
                  
                  {/* Animated particles around text */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-sky-400 rounded-full"
                      style={{
                        top: `${20 + i * 15}%`,
                        right: `-${5 + i * 3}px`
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1.2, 0.5],
                        y: [0, -10, 0]
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Dynamic underline */}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 rounded-full"
                    initial={{ width: "0%", opacity: 0 }}
                    animate={{ 
                      width: "100%", 
                      opacity: 1,
                      boxShadow: ["0 0 5px rgba(14, 165, 233, 0.5)", "0 0 15px rgba(14, 165, 233, 0.8)", "0 0 5px rgba(14, 165, 233, 0.5)"]
                    }}
                    transition={{ 
                      width: { delay: 0.5, duration: 0.8 },
                      opacity: { delay: 0.5, duration: 0.3 },
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                </motion.span>
              </motion.div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "text-secondary hover:text-primary transition-colors duration-300 font-medium cursor-pointer",
                    location === item.href && "text-primary"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            
            {/* Authentication UI - Show loading or auth content based on state */}
            {isLoading ? (
              <span className="text-gray-500 text-sm">جارٍ التحميل...</span>
            ) : !isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="outline" className="ml-2">
                    <User className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="ml-2">
                    <UserPlus className="w-4 h-4 ml-2" />
                    إنشاء حساب
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-2">
                    <User className="w-4 h-4 ml-2" />
                    {user?.name || "المستخدم"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem onSelect={closeMobileMenu}>
                      <HomeIcon className="mr-2 h-4 w-4" />
                      <span>الداشبورد</span>
                    </DropdownMenuItem>
                  </Link>
                  {user?.role === 'admin' && (
                    <>
                      <Link href="/admin/crm">
                        <DropdownMenuItem onSelect={closeMobileMenu}>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>نظام CRM</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/dashboard">
                        <DropdownMenuItem onSelect={closeMobileMenu}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>لوحة الإدارة</span>
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <Link href="/settings">
                    <DropdownMenuItem onSelect={closeMobileMenu}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>الإعدادات</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Link href="/services">
              <Button className="btn-primary ml-2">
                <Star className="w-4 h-4 ml-2" />
                اشتراك
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-secondary hover:text-primary"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMobileMenu}>
                  <span
                    className={cn(
                      "block px-3 py-2 text-secondary hover:text-primary transition-colors duration-300 cursor-pointer",
                      location === item.href && "text-primary"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
              
              {/* Mobile Authentication UI */}
              {isLoading ? (
                <div className="px-3 py-2 text-gray-500 text-sm">جارٍ التحميل...</div>
              ) : !isAuthenticated ? (
                <>
                  <Link href="/login" onClick={closeMobileMenu}>
                    <span className="block px-3 py-2 text-secondary hover:text-primary transition-colors duration-300 cursor-pointer">
                      تسجيل الدخول
                    </span>
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu}>
                    <span className="block px-3 py-2 text-secondary hover:text-primary transition-colors duration-300 cursor-pointer">
                      إنشاء حساب
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-secondary">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={closeMobileMenu}>
                    <span className="block px-3 py-2 text-secondary hover:text-primary transition-colors duration-300 cursor-pointer">
                      الداشبورد
                    </span>
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="block w-full text-right px-3 py-2 text-secondary hover:text-primary transition-colors duration-300 cursor-pointer"
                  >
                    تسجيل الخروج
                  </button>
                </>
              )}
              
              <Link href="/services" onClick={closeMobileMenu}>
                <span className="block px-3 py-2 text-secondary hover:text-primary transition-colors duration-300 cursor-pointer">
                  اشتراك
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
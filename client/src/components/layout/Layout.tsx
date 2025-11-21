import { ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ScrollIndicator, ScrollToTop } from "@/components/ui/scroll-indicator";
import { useLanguage } from "@/i18n/lang";

interface LayoutProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
  className?: string;
}

/**
 * Main layout wrapper for marketing/content pages
 * Follows Services/Home page design system
 */
export function Layout({ 
  children, 
  showBreadcrumbs = true, 
  className = "" 
}: LayoutProps) {
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen font-cairo" dir={dir}>
      <ScrollIndicator />
      <Navbar />
      {showBreadcrumbs && <Breadcrumbs />}
      <main className={`scroll-smooth ${className}`}>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
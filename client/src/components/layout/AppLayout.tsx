import { ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";
import { ScrollIndicator, ScrollToTop } from "@/components/ui/scroll-indicator";
import { useLanguage } from "@/i18n/lang";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  sidebar?: ReactNode;
}

/**
 * App layout wrapper for CRM/dashboard pages
 * Follows Services/Home page design system with app-specific modifications
 */
export function AppLayout({ 
  children, 
  className = "",
  sidebar
}: AppLayoutProps) {
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen font-cairo bg-brand-sky-light/30" dir={dir}>
      <ScrollIndicator />
      <Navbar />
      
      <div className="flex min-h-screen pt-16">
        {sidebar && (
          <aside className={cn(
            "w-64 bg-white border-r border-brand-sky-base shadow-sm",
            dir === 'rtl' ? "border-l border-r-0" : "border-r"
          )}>
            {sidebar}
          </aside>
        )}
        
        <main className={cn(
          "flex-1 scroll-smooth",
          className
        )}>
          {children}
        </main>
      </div>
      
      <ScrollToTop />
    </div>
  );
}
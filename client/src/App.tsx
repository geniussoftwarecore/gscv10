import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { LanguageProvider } from "@/i18n/lang";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MetaTags } from "@/components/seo/meta-tags";
import { ScrollIndicator, ScrollToTop } from "@/components/ui/scroll-indicator";
import { Suspense, lazy, useEffect } from "react";
import { useLocation } from "wouter";
import { PageSkeleton } from "@/components/ui/page-skeleton";

// Critical routes - loaded immediately
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Non-critical routes - lazy loaded with specialized skeletons
const About = lazy(() => import("@/pages/about"));
const Services = lazy(() => import("@/pages/services"));
const ServiceDetail = lazy(() => import("@/pages/service-detail"));
const MobileDetail = lazy(() => import("@/pages/services/mobile"));
const WebDetail = lazy(() => import("@/pages/services/web"));
const DesktopDetail = lazy(() => import("@/pages/services/desktop"));
const GraphicsDesignService = lazy(() => import("@/pages/services/GraphicsDesignService"));
const ERPNextPage = lazy(() => import("@/pages/erpnext"));
const PortfolioIndex = lazy(() => import("@/pages/portfolio/index"));
const ProjectDetail = lazy(() => import("@/pages/project-detail"));
const Frameworks = lazy(() => import("@/pages/frameworks"));
const Contact = lazy(() => import("@/pages/contact"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const ChangePassword = lazy(() => import("@/pages/change-password"));
const Settings = lazy(() => import("@/pages/settings"));

// Heavy admin/CRM components with separate chunk loading
const AdminPanel = lazy(() => import("@/pages/admin"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const CrmDashboard = lazy(() => import("@/pages/CrmDashboard"));

// Dev components (only loaded in dev mode)
const UIPreview = lazy(() => import("@/dev/ui-preview"));
const ComponentsPreview = lazy(() => import("@/dev/components-preview"));
const CRMComponentsPreview = lazy(() => import("@/dev/crm-components-preview"));
const SearchDemo = lazy(() => import("@/pages/SearchDemo"));
const TestRunner = lazy(() => import("@/dev/test-runner"));

// Import specialized skeletons
import { 
  PortfolioSkeleton, 
  ServicesSkeleton, 
  DashboardSkeleton, 
  CrmSkeleton, 
  ContactSkeleton 
} from "@/components/ui/specialized-skeletons";

// Protected route wrapper that enforces password change
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { forcePasswordChange, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && forcePasswordChange && window.location.pathname !== '/change-password') {
      setLocation('/change-password');
    }
  }, [isAuthenticated, forcePasswordChange, setLocation]);

  if (isAuthenticated && forcePasswordChange && window.location.pathname !== '/change-password') {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about">
        <Suspense fallback={<PageSkeleton />}>
          <About />
        </Suspense>
      </Route>
      <Route path="/services">
        <Suspense fallback={<ServicesSkeleton />}>
          <Services />
        </Suspense>
      </Route>
      <Route path="/services/mobile">
        <Suspense fallback={<PageSkeleton />}>
          <MobileDetail />
        </Suspense>
      </Route>
      <Route path="/services/4af08917-6ecf-42eb-a0f8-41f225acfc32">
        <Suspense fallback={<PageSkeleton />}>
          <WebDetail />
        </Suspense>
      </Route>
      <Route path="/services/d7e8f9g0-h1i2-j3k4-l5m6-n7o8p9q0r1s2">
        <Suspense fallback={<PageSkeleton />}>
          <DesktopDetail />
        </Suspense>
      </Route>
      <Route path="/services/9a6c839d-2a5c-4418-832a-2a5bd14dcf7e">
        <Suspense fallback={<PageSkeleton />}>
          <GraphicsDesignService />
        </Suspense>
      </Route>
      <Route path="/services/:id">
        <Suspense fallback={<PageSkeleton />}>
          <ServiceDetail />
        </Suspense>
      </Route>
      <Route path="/erpnext">
        <Suspense fallback={<PageSkeleton />}>
          <ERPNextPage />
        </Suspense>
      </Route>
      <Route path="/portfolio">
        <Suspense fallback={<PortfolioSkeleton />}>
          <PortfolioIndex />
        </Suspense>
      </Route>
      <Route path="/portfolio/:slug">
        <Suspense fallback={<PortfolioSkeleton />}>
          <ProjectDetail />
        </Suspense>
      </Route>
      <Route path="/frameworks">
        <Suspense fallback={<PageSkeleton />}>
          <Frameworks />
        </Suspense>
      </Route>
      <Route path="/contact">
        <Suspense fallback={<ContactSkeleton />}>
          <Contact />
        </Suspense>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/login">
        <Suspense fallback={<PageSkeleton />}>
          <Login />
        </Suspense>
      </Route>
      <Route path="/register">
        <Suspense fallback={<PageSkeleton />}>
          <Register />
        </Suspense>
      </Route>
      <Route path="/change-password">
        <Suspense fallback={<PageSkeleton />}>
          <ChangePassword />
        </Suspense>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Suspense fallback={<PageSkeleton />}>
            <Settings />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute>
          <Suspense fallback={<PageSkeleton />}>
            <AdminPanel />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/dashboard">
        <ProtectedRoute>
          <Suspense fallback={<PageSkeleton />}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/crm">
        <ProtectedRoute>
          <Suspense fallback={<CrmSkeleton />}>
            <CrmDashboard />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/crm">
        <ProtectedRoute>
          <Suspense fallback={<CrmSkeleton />}>
            <CrmDashboard />
          </Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/search-demo">
        <Suspense fallback={<PageSkeleton />}>
          <SearchDemo />
        </Suspense>
      </Route>
      <Route path="/dev/ui-preview">
        <Suspense fallback={<PageSkeleton />}>
          <UIPreview />
        </Suspense>
      </Route>
      <Route path="/dev/components">
        <Suspense fallback={<PageSkeleton />}>
          <ComponentsPreview />
        </Suspense>
      </Route>
      <Route path="/dev/crm">
        <Suspense fallback={<PageSkeleton />}>
          <CRMComponentsPreview />
        </Suspense>
      </Route>
      <Route path="/dev/test-runner">
        <Suspense fallback={<PageSkeleton />}>
          <TestRunner />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProviderWrapper>
              <TooltipProvider>
                <div className="min-h-screen font-cairo">
                  <MetaTags />
                  <ScrollIndicator />
                  <Navbar />
                  <Breadcrumbs />
                  <main className="scroll-smooth">
                    <Router />
                  </main>
                  <Footer />
                  <ScrollToTop />
                  <Toaster />
                </div>
              </TooltipProvider>
            </NotificationProviderWrapper>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

function NotificationProviderWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <NotificationProvider userId={user?.id}>
      {children}
    </NotificationProvider>
  );
}

export default App;

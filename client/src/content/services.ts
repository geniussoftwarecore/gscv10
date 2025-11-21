export type Service = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  deliverables: string[];
  inputsNeeded: string[];
  interactiveIdeas: string[];
  category: "Web" | "Mobile" | "ERP" | "AI" | "Design" | "Cloud" | "Data" | "Commerce" | "Support";
  icon?: string; // lucide-react icon name if available in the project
  cta?: { label: string; href: string; };
};

export const services: Service[] = [
  {
    id: "web-dev",
    name: "Web Development",
    tagline: "Modern, fast, secure websites and web apps.",
    description: "We build responsive interfaces, modular codebases, and SEO-ready web experiences that are easy to maintain and scale.",
    features: ["Responsive UI", "Clean architecture", "SEO basics", "Performance budget"],
    deliverables: ["Page templates", "Reusable components", "CI build", "Docs for handover"],
    inputsNeeded: ["Brand assets", "Site map/sections", "Reference links"],
    interactiveIdeas: ["Tech stack selector (Static/SSR)", "Quick quote estimator"],
    category: "Web",
    icon: "Globe",
    cta: { label: "Request a Proposal", href: "/contact?subject=Web%20Development" }
  },
  {
    id: "mobile-apps",
    name: "Mobile App Development",
    tagline: "Native-quality apps for Android & iOS with one codebase.",
    description: "Flutter-based apps with solid navigation, secure auth, and analytics. Release pipelines and store-ready deliverables included.",
    features: ["Flutter codebase", "Secure auth", "Crash/analytics hooks", "Store bundles"],
    deliverables: ["Android APK/AAB", "iOS IPA (where applicable)", "CI/CD pipeline", "Release notes template"],
    inputsNeeded: ["Feature list", "Target OS versions", "Launch timing"],
    interactiveIdeas: ["Feature toggles (push/offline)", "Release plan timeline"],
    category: "Mobile",
    icon: "Smartphone",
    cta: { label: "Request a Proposal", href: "/contact?subject=Mobile%20Apps" }
  },
  {
    id: "erpnext",
    name: "ERPNext Implementation",
    tagline: "Tailored ERPNext setup, data migration, and training.",
    description: "Configure modules, roles, and reports around your real workflows. We migrate data safely and train your team.",
    features: ["Module setup", "Custom scripts", "Reports", "Role-based access"],
    deliverables: ["Configured modules", "User roles & permissions", "Sample reports", "Training sessions"],
    inputsNeeded: ["Current workflows", "Sample data", "Approval matrix"],
    interactiveIdeas: ["Module picker", "Migration readiness checklist"],
    category: "ERP",
    icon: "Boxes",
    cta: { label: "Request a Proposal", href: "/contact?subject=ERPNext" }
  },
  {
    id: "custom-erp-crm",
    name: "Custom ERP/CRM",
    tagline: "When off-the-shelf isn't enough—build what fits your business.",
    description: "We model your domain, design APIs and permissions, and deliver dashboards that match how your teams work.",
    features: ["Domain modeling", "API design", "Dashboards", "Granular permissions"],
    deliverables: ["Data model", "Endpoints", "Admin console", "Dashboards"],
    inputsNeeded: ["Entities/objects", "Process maps", "KPIs"],
    interactiveIdeas: ["Data model visualizer", "Dashboard presets"],
    category: "ERP",
    icon: "Workflow",
    cta: { label: "Request a Proposal", href: "/contact?subject=Custom%20ERP%2FCRM" }
  },
  {
    id: "ai-automation",
    name: "AI Agents & Automation",
    tagline: "Automate support, back-office, and data tasks with safe AI workflows.",
    description: "We orchestrate tools with guardrails and audit trails so tasks get done quickly and responsibly.",
    features: ["Tool use", "Guardrails", "Audit logs", "Escalation paths"],
    deliverables: ["Agent workflows", "Eval tests", "Safety config", "Runbooks"],
    inputsNeeded: ["Target tasks", "Data sources", "Risk tolerance"],
    interactiveIdeas: ["Task builder wizard", "Automation ROI calculator"],
    category: "AI",
    icon: "Bot",
    cta: { label: "Request a Proposal", href: "/contact?subject=AI%20Automation" }
  },
  {
    id: "ui-ux-branding",
    name: "UI/UX & Branding",
    tagline: "Interfaces that look great and work even better.",
    description: "From wireframes to polished components, we design systems that are accessible, consistent, and delightful.",
    features: ["Wireframes", "Design tokens", "Component library", "Accessibility review"],
    deliverables: ["Brand kit", "High-fidelity mockups", "Tokens", "Prototype"],
    inputsNeeded: ["Audience & tone", "Competitors", "Brand constraints"],
    interactiveIdeas: ["Theme previewer", "Font toggle"],
    category: "Design",
    icon: "Palette",
    cta: { label: "Request a Proposal", href: "/contact?subject=UI%2FUX%20%26%20Branding" }
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    tagline: "From laptop to production—repeatable, reliable, secure.",
    description: "We containerize your app, set up CI/CD, and script infrastructure so deployments are boring and safe.",
    features: ["Dockerization", "CI/CD", "Infra as code", "Monitoring/alerts"],
    deliverables: ["Pipelines", "IaC scripts", "Dashboards", "Playbooks"],
    inputsNeeded: ["Hosting choice", "Uptime/SLA", "Budget"],
    interactiveIdeas: ["Deployment target selector", "SLA checklist"],
    category: "Cloud",
    icon: "Cloud",
    cta: { label: "Request a Proposal", href: "/contact?subject=Cloud%20%26%20DevOps" }
  },
  {
    id: "data-analytics",
    name: "Data & Analytics",
    tagline: "Turn raw data into dashboards and decisions.",
    description: "We define KPIs, build pipelines, and ship dashboards your teams will actually use.",
    features: ["Data modeling", "ETL/ELT", "KPI dashboards", "Alerting"],
    deliverables: ["Data models", "Pipelines", "Dashboards", "Alert rules"],
    inputsNeeded: ["Data sources", "KPI definitions", "Update cadence"],
    interactiveIdeas: ["KPI selector", "Dashboard gallery"],
    category: "Data",
    icon: "BarChartBig",
    cta: { label: "Request a Proposal", href: "/contact?subject=Data%20%26%20Analytics" }
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    tagline: "Storefronts built for conversion and scale.",
    description: "We implement product catalogs, payments, and order flows tuned for speed and trust.",
    features: ["Catalog", "Checkout", "Payments", "Promos"],
    deliverables: ["Storefront", "Payment integration", "Order tracking", "Promo tools"],
    inputsNeeded: ["Catalog structure", "Shipping rules", "Payment providers"],
    interactiveIdeas: ["Conversion checklist", "Promotion planner"],
    category: "Commerce",
    icon: "ShoppingCart",
    cta: { label: "Request a Proposal", href: "/contact?subject=E-Commerce" }
  },
  {
    id: "maintenance-support",
    name: "Maintenance & Support",
    tagline: "Keep everything updated, monitored, and running smoothly.",
    description: "Proactive maintenance with security updates, backups, and clear monthly health reports.",
    features: ["Patching", "Backups", "Uptime checks", "Reports"],
    deliverables: ["Maintenance plan", "SLA", "Monitoring", "Monthly report"],
    inputsNeeded: ["Contact ladder", "Maintenance windows", "Environments"],
    interactiveIdeas: ["Plan selector (Basic/Pro/Enterprise)", "Incident SLA timeline"],
    category: "Support",
    icon: "LifeBuoy",
    cta: { label: "Request a Proposal", href: "/contact?subject=Maintenance%20%26%20Support" }
  }
];